import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async getAllDistricts() {
    return this.prisma.district.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        stateId: true,
        state: { select: { id: true, name: true } },
      },
    });
  }

  async getMandalsByDistrict(districtId: number) {
    const district = await this.prisma.district.findUnique({
      where: { id: districtId },
    });

    if (!district) {
      throw new NotFoundException(`District with id ${districtId} not found`);
    }

    return this.prisma.mandal.findMany({
      where: { districtId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        districtId: true,
      },
    });
  }

  async getVillagesByMandal(mandalId: number) {
    const mandal = await this.prisma.mandal.findUnique({
      where: { id: mandalId },
    });

    if (!mandal) {
      throw new NotFoundException(`Mandal with id ${mandalId} not found`);
    }

    return this.prisma.village.findMany({
      where: { mandalId },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        mandalId: true,
      },
    });
  }
}
