import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { successResponse } from '../../common/response/api-response';
import { AuditService } from './audit.service';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('audit.view')
export class AuditController {
  constructor(private audit: AuditService) {}

  @Get()
  async list(
    @Query('module') module?: string,
    @Query('actorId') actorId?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '25',
  ) {
    const data = await this.audit.list({
      module: module || undefined,
      actorId: actorId ? Number(actorId) : undefined,
      page: Math.max(1, Number(page) || 1),
      pageSize: Math.min(100, Math.max(1, Number(pageSize) || 25)),
    });
    return successResponse(data);
  }
}
