import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { successResponse } from '../../common/response/api-response';
import { OptionalJwtGuard } from '../rbac/optional-jwt.guard';
import { RequirePermissions } from '../rbac/permissions.decorator';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { CreateMenuDto, ReorderMenusDto, UpdateMenuDto } from './menu.dto';
import { MenusService } from './menus.service';

/** Public: what the end-user app renders. */
@Controller('menus')
export class PublicMenusController {
  constructor(private menus: MenusService) {}

  @Get()
  @UseGuards(OptionalJwtGuard)
  async tree(@CurrentUser() user: any) {
    return successResponse(await this.menus.publicTree(user));
  }
}

@Controller('admin/menus')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('menus.manage')
export class AdminMenusController {
  constructor(private menus: MenusService) {}

  @Get() async list() { return successResponse(await this.menus.adminTree()); }

  @Post()
  async create(@Body() dto: CreateMenuDto, @CurrentUser() u: any, @Req() req: any) {
    return successResponse(await this.menus.create(dto, u, req.ip), 'Menu created');
  }

  // Declared before ':id' routes so "reorder" is not parsed as an id.
  @Put('reorder')
  async reorder(@Body() dto: ReorderMenusDto, @CurrentUser() u: any, @Req() req: any) {
    await this.menus.reorder(dto, u, req.ip);
    return successResponse(null, 'Menu order saved');
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMenuDto, @CurrentUser() u: any, @Req() req: any) {
    return successResponse(await this.menus.update(id, dto, u, req.ip), 'Menu updated');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() u: any, @Req() req: any) {
    await this.menus.remove(id, u, req.ip);
    return successResponse(null, 'Menu deleted');
  }
}
