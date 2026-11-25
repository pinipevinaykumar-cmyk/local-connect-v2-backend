import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreateMenuDto, ReorderMenusDto, UpdateMenuDto } from './menu.dto';

type Actor = { id: number; username?: string };
type MenuRow = Awaited<ReturnType<MenusService['loadAll']>>[number];
type Node = Omit<MenuRow, 'roles'> & { roleIds: number[]; children: Node[] };

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  private loadAll() {
    return this.prisma.menu.findMany({
      include: { roles: { select: { roleId: true } } },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
  }

  private toTree(rows: MenuRow[]): Node[] {
    const nodes = new Map<number, Node>();
    rows.forEach(({ roles, ...m }) =>
      nodes.set(m.id, { ...m, roleIds: roles.map((r) => r.roleId), children: [] }),
    );
    const roots: Node[] = [];
    nodes.forEach((n) => {
      const parent = n.parentId ? nodes.get(n.parentId) : undefined;
      (parent ? parent.children : roots).push(n);
    });
    return roots;
  }

  /** Menu tree for end users: enabled only, filtered by the caller's role. */
  async publicTree(user: { userType?: string; roleId?: number | null } | null) {
    const rows = await this.loadAll();
    const isSuper = user?.userType === 'ADMIN';
    const prune = (nodes: Node[]): Node[] =>
      nodes
        .filter((n) => n.isEnabled && (isSuper || n.roleIds.length === 0 ||
          (user?.roleId != null && n.roleIds.includes(user.roleId))))
        .map((n) => ({ ...n, children: prune(n.children) }));
    return prune(this.toTree(rows));
  }

  async adminTree() {
    return this.toTree(await this.loadAll());
  }

  async create(dto: CreateMenuDto, actor: Actor, ip?: string) {
    const { roleIds, ...data } = dto;
    if (dto.parentId) await this.assertExists(dto.parentId);
    const menu = await this.prisma.menu.create({
      data: { ...data, ...(roleIds?.length ? { roles: { create: roleIds.map((roleId) => ({ roleId })) } } : {}) },
    });
    await this.audit.log({ actor, action: 'create', module: 'menus', entityId: menu.id, after: menu, ip });
    return menu;
  }

  async update(id: number, dto: UpdateMenuDto, actor: Actor, ip?: string) {
    const before = await this.assertExists(id);
    const { roleIds, ...data } = dto;
    if (dto.parentId != null) {
      if (dto.parentId === id) throw new BadRequestException('A menu cannot be its own parent');
      await this.assertNoCycle(id, dto.parentId);
    }
    const after = await this.prisma.$transaction(async (tx) => {
      if (roleIds) {
        await tx.menuRole.deleteMany({ where: { menuId: id } });
        await tx.menuRole.createMany({ data: roleIds.map((roleId) => ({ menuId: id, roleId })) });
      }
      return tx.menu.update({ where: { id }, data });
    });
    await this.audit.log({ actor, action: dto.isEnabled !== undefined && Object.keys(dto).length === 1 ? (dto.isEnabled ? 'enable' : 'disable') : 'update', module: 'menus', entityId: id, before, after, ip });
    return after;
  }

  async remove(id: number, actor: Actor, ip?: string) {
    const before = await this.assertExists(id);
    await this.prisma.menu.delete({ where: { id } }); // children cascade
    await this.audit.log({ actor, action: 'delete', module: 'menus', entityId: id, before, ip });
  }

  /** Drag & drop: persist order / parent / section for many menus atomically. */
  async reorder(dto: ReorderMenusDto, actor: Actor, ip?: string) {
    const ids = new Set(dto.items.map((i) => i.id));
    for (const i of dto.items) {
      if (i.parentId === i.id) throw new BadRequestException('A menu cannot be its own parent');
      if (i.parentId != null && !ids.has(i.parentId)) await this.assertExists(i.parentId);
    }
    await this.prisma.$transaction(
      dto.items.map((i) =>
        this.prisma.menu.update({
          where: { id: i.id },
          data: { order: i.order, parentId: i.parentId ?? null, ...(i.section ? { section: i.section } : {}) },
        }),
      ),
    );
    await this.audit.log({ actor, action: 'reorder', module: 'menus', after: dto.items, ip });
  }

  private async assertExists(id: number) {
    const m = await this.prisma.menu.findUnique({ where: { id } });
    if (!m) throw new NotFoundException(`Menu ${id} not found`);
    return m;
  }

  private async assertNoCycle(id: number, newParentId: number) {
    let cur: number | null = newParentId;
    for (let depth = 0; cur && depth < 20; depth++) {
      if (cur === id) throw new BadRequestException('Menu cannot be moved under its own descendant');
      const p: { parentId: number | null } | null = await this.prisma.menu.findUnique({ where: { id: cur }, select: { parentId: true } });
      cur = p?.parentId ?? null;
    }
  }
}
