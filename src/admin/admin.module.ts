import { Module } from '@nestjs/common';
import { AuditController } from './audit/audit.controller';
import { AuditService } from './audit/audit.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { AdminFeaturesController, PublicFeaturesController } from './features/features.controller';
import { FeaturesService } from './features/features.service';
import { AdminMenusController, PublicMenusController } from './menus/menus.controller';
import { MenusService } from './menus/menus.service';
import { PermissionsGuard } from './rbac/permissions.guard';

@Module({
  controllers: [
    PublicMenusController, AdminMenusController,
    PublicFeaturesController, AdminFeaturesController,
    AuditController, DashboardController,
  ],
  providers: [MenusService, FeaturesService, AuditService, PermissionsGuard],
  exports: [AuditService],
})
export class AdminModule {}
