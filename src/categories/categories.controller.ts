import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { successResponse } from '../common/response/api-response';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll() {
    const data = await this.categoriesService.findAll();
    return successResponse(data, 'Categories retrieved successfully');
  }
}
