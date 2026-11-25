import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface AuditEntry {
  actor?: { id: number; username?: string } | null;
  action: string;
  module: string;
  entityId?: string | number;
  before?: unknown;
  after?: unknown;
  ip?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /** Never throws: an audit failure must not break the admin action. */
  async log(e: AuditEntry) {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: e.actor?.id,
          actorName: e.actor?.username,
          action: e.action,
          module: e.module,
          entityId: e.entityId != null ? String(e.entityId) : undefined,
          before: (e.before ?? undefined) as any,
          after: (e.after ?? undefined) as any,
          ip: e.ip,
        },
      });
    } catch (err) {
      console.error('audit log failed', err);
    }
  }

  async list(q: { module?: string; actorId?: number; page: number; pageSize: number }) {
    const where = {
      ...(q.module ? { module: q.module } : {}),
      ...(q.actorId ? { actorId: q.actorId } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (q.page - 1) * q.pageSize,
        take: q.pageSize,
      }),
      this.prisma.auditLog.count({ where }),
    ]);
    return { items, total, page: q.page, pageSize: q.pageSize };
  }
}
