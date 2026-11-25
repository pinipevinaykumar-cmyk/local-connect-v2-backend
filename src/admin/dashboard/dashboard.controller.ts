import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/response/api-response';
import { PrismaService } from '../../prisma/prisma.service';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { PermissionsGuard, resolvePermissions } from '../rbac/permissions.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DashboardController {
  constructor(private prisma: PrismaService) {}

  /** Any authenticated admin-console user: who am I and what can I do. */
  @Get('me')
  async me(@CurrentUser() user: any) {
    const permissions = await resolvePermissions(this.prisma, user);
    return successResponse({ id: user.id, username: user.username, userType: user.userType, permissions });
  }

  @Get('dashboard')
  @RequirePermissions('dashboard.view')
  async stats() {
    const since = new Date(Date.now() - 14 * 86400_000);
    const [totalUsers, activeUsers, totalBusinesses, verifiedBusinesses, pendingApprovals,
      totalCategories, recentActivity, signups, shopSignups] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.shop.count(),
      this.prisma.shop.count({ where: { verificationStatus: 'VERIFIED' } }),
      this.prisma.shop.count({ where: { verificationStatus: 'PENDING_VERIFICATION' } }),
      this.prisma.category.count(),
      this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
      this.prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      this.prisma.shop.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    ]);

    const bucket = (rows: { createdAt: Date }[]) => {
      const out: Record<string, number> = {};
      for (let i = 13; i >= 0; i--) out[new Date(Date.now() - i * 86400_000).toISOString().slice(0, 10)] = 0;
      rows.forEach((r) => { const k = r.createdAt.toISOString().slice(0, 10); if (k in out) out[k]++; });
      return Object.entries(out).map(([date, count]) => ({ date, count }));
    };

    return successResponse({
      kpis: { totalUsers, activeUsers, totalBusinesses, verifiedBusinesses, pendingApprovals, totalCategories },
      userGrowth: bucket(signups),
      businessGrowth: bucket(shopSignups),
      recentActivity,
    });
  }
}
