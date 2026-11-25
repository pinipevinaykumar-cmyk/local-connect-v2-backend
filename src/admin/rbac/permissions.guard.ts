import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY } from './permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]) ?? [];
    const req = ctx.switchToHttp().getRequest();
    const granted = await resolvePermissions(this.prisma, req.user);
    req.permissions = granted;
    if (granted.includes('*') || required.every((p) => granted.includes(p))) return true;
    throw new ForbiddenException('Missing permission: ' + required.join(', '));
  }
}

/** Legacy userType ADMIN is treated as super admin ('*'). */
export async function resolvePermissions(prisma: PrismaService, user: any): Promise<string[]> {
  if (!user) return [];
  if (user.userType === 'ADMIN') return ['*'];
  if (!user.roleId) return [];
  const rows = await prisma.rolePermission.findMany({
    where: { roleId: user.roleId },
    select: { permission: { select: { key: true } } },
  });
  return rows.map((r) => r.permission.key);
}
