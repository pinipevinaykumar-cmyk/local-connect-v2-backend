import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { successResponse } from '../common/response/api-response';
import { ShopStatus } from '@prisma/client';

@Controller('businesses')
export class BusinessesController {
  constructor(private businessesService: BusinessesService) {}

  @Get()
  async findAll(
    @Query('districtId') districtId?: string,
    @Query('mandalId') mandalId?: string,
    @Query('villageId') villageId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: ShopStatus,
  ) {
    const filters = {
      districtId: districtId ? parseInt(districtId, 10) : undefined,
      mandalId: mandalId ? parseInt(mandalId, 10) : undefined,
      villageId: villageId ? parseInt(villageId, 10) : undefined,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      status,
    };

    const data = await this.businessesService.findAll(filters);
    return successResponse(data, 'Businesses retrieved successfully');
  }

  @Get('search')
  async search(
    @Query('q') q: string,
    @Query('villageId') villageId?: string,
  ) {
    const data = await this.businessesService.search(
      q || '',
      villageId ? parseInt(villageId, 10) : undefined,
    );
    return successResponse(data, 'Search results retrieved');
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyBusinesses(@CurrentUser() user: any) {
    const data = await this.businessesService.getMyBusinesses(user.id);
    return successResponse(data, 'Your businesses retrieved successfully');
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.businessesService.findOne(id);
    return successResponse(data, 'Business retrieved successfully');
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateBusinessDto, @CurrentUser() user: any) {
    const data = await this.businessesService.create(dto, user.id);
    return successResponse(data, 'Business created successfully');
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: any,
  ) {
    const data = await this.businessesService.updateStatus(id, dto, user.id, user.userType);
    return successResponse(data, 'Business status updated successfully');
  }
}
