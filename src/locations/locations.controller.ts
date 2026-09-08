import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { successResponse } from '../common/response/api-response';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get('districts')
  async getAllDistricts() {
    const data = await this.locationsService.getAllDistricts();
    return successResponse(data, 'Districts retrieved successfully');
  }

  @Get('districts/:id/mandals')
  async getMandalsByDistrict(@Param('id', ParseIntPipe) id: number) {
    const data = await this.locationsService.getMandalsByDistrict(id);
    return successResponse(data, 'Mandals retrieved successfully');
  }

  @Get('mandals/:id/villages')
  async getVillagesByMandal(@Param('id', ParseIntPipe) id: number) {
    const data = await this.locationsService.getVillagesByMandal(id);
    return successResponse(data, 'Villages retrieved successfully');
  }
}
