import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/response/api-response';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { CreateFeatureDto, FeaturesService, UpdateFeatureDto } from './features.service';

@Controller('features')
export class PublicFeaturesController {
  constructor(private features: FeaturesService) {}
  @Get('map') async map() { return successResponse(await this.features.map()); }
}

@Controller('admin/features')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('features.manage')
export class AdminFeaturesController {
  constructor(private features: FeaturesService) {}

  @Get() async list() { return successResponse(await this.features.list()); }

  @Post()
  async create(@Body() dto: CreateFeatureDto, @CurrentUser() u: any, @Req() req: any) {
    return successResponse(await this.features.create(dto, u, req.ip), 'Feature created');
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFeatureDto, @CurrentUser() u: any, @Req() req: any) {
    return successResponse(await this.features.update(id, dto, u, req.ip), 'Feature updated');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: any, @Req() req: any) {
    await this.features.remove(id, u, req.ip);
    return successResponse(null, 'Feature deleted');
  }
}
