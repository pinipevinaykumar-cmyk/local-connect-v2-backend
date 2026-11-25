import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { SystemModulesService } from './system-modules.service';
import { UpdateModuleStatusDto } from './dto/update-module-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { successResponse } from '../common/response/api-response';

@Controller('system-modules')
export class SystemModulesController {
  constructor(private readonly service: SystemModulesService) {}

  /** Public — frontend reads this on load */
  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return successResponse(data);
  }

  /** Public status map for easy lookup */
  @Get('map')
  async statusMap() {
    const data = await this.service.getStatusMap();
    return successResponse(data);
  }

  /** Admin only — update a single module's status */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateModuleStatusDto,
    @CurrentUser() user: any,
  ) {
    if (user.userType !== 'ADMIN') throw new ForbiddenException('Admin only');
    const data = await this.service.updateStatus(id, dto, user.id);
    return successResponse(data, 'Module status updated');
  }
}
