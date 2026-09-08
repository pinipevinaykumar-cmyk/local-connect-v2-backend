import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ShopStatus } from '@prisma/client';

interface BusinessFilters {
  districtId?: number;
  mandalId?: number;
  villageId?: number;
  categoryId?: number;
  status?: ShopStatus;
}

const shopSelectFields = {
  id: true,
  name: true,
  ownerName: true,
  description: true,
  phone: true,
  whatsapp: true,
  address: true,
  status: true,
  openTime: true,
  closeTime: true,
  is24Hours: true,
  hasDelivery: true,
  imageUrl: true,
  coverUrl: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
  categoryId: true,
  districtId: true,
  mandalId: true,
  villageId: true,
  owner: {
    select: { id: true, username: true, phone: true },
  },
  category: {
    select: { id: true, name: true, icon: true },
  },
  district: {
    select: { id: true, name: true },
  },
  mandal: {
    select: { id: true, name: true },
  },
  village: {
    select: { id: true, name: true },
  },
};

@Injectable()
export class BusinessesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: BusinessFilters) {
    const where: any = { isActive: true };

    if (filters.districtId) where.districtId = filters.districtId;
    if (filters.mandalId) where.mandalId = filters.mandalId;
    if (filters.villageId) where.villageId = filters.villageId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.status) where.status = filters.status;

    return this.prisma.shop.findMany({
      where,
      select: shopSelectFields,
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: number) {
    const shop = await this.prisma.shop.findUnique({
      where: { id },
      select: shopSelectFields,
    });

    if (!shop || !shop.isActive) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }

    return shop;
  }

  async search(q: string, villageId?: number) {
    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { ownerName: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ],
    };

    if (villageId) where.villageId = villageId;

    return this.prisma.shop.findMany({
      where,
      select: shopSelectFields,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateBusinessDto, ownerId: number) {
    // Validate location ids if provided
    if (dto.districtId) {
      const district = await this.prisma.district.findUnique({ where: { id: dto.districtId } });
      if (!district) throw new BadRequestException('Invalid districtId');
    }

    if (dto.mandalId) {
      const mandal = await this.prisma.mandal.findUnique({ where: { id: dto.mandalId } });
      if (!mandal) throw new BadRequestException('Invalid mandalId');
    }

    if (dto.villageId) {
      const village = await this.prisma.village.findUnique({ where: { id: dto.villageId } });
      if (!village) throw new BadRequestException('Invalid villageId');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (!category) throw new BadRequestException('Invalid categoryId');
    }

    return this.prisma.shop.create({
      data: {
        ...dto,
        ownerId,
      },
      select: shopSelectFields,
    });
  }

  async updateStatus(id: number, dto: UpdateStatusDto, userId: number, userType: string) {
    const shop = await this.prisma.shop.findUnique({ where: { id } });

    if (!shop || !shop.isActive) {
      throw new NotFoundException(`Business with id ${id} not found`);
    }

    // Only the owner or an admin can update status
    if (shop.ownerId !== userId && userType !== 'ADMIN') {
      throw new ForbiddenException('You are not authorized to update this business');
    }

    return this.prisma.shop.update({
      where: { id },
      data: { status: dto.status },
      select: shopSelectFields,
    });
  }

  async getMyBusinesses(ownerId: number) {
    return this.prisma.shop.findMany({
      where: { ownerId, isActive: true },
      select: shopSelectFields,
      orderBy: { createdAt: 'desc' },
    });
  }
}
