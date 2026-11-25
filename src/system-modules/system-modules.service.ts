import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ModuleStatus } from '@prisma/client';
import { UpdateModuleStatusDto } from './dto/update-module-status.dto';

@Injectable()
export class SystemModulesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.systemModule.findMany({
      orderBy: [{ parentModule: 'asc' }, { displayOrder: 'asc' }],
    });
  }

  async findByName(moduleName: string) {
    return this.prisma.systemModule.findUnique({ where: { moduleName } });
  }

  async updateStatus(id: number, dto: UpdateModuleStatusDto, updatedBy: number) {
    const module = await this.prisma.systemModule.findUnique({ where: { id } });
    if (!module) throw new NotFoundException(`Module ${id} not found`);

    return this.prisma.systemModule.update({
      where: { id },
      data: { status: dto.status, updatedBy },
    });
  }

  async getStatusMap(): Promise<Record<string, ModuleStatus>> {
    const modules = await this.findAll();
    return Object.fromEntries(modules.map((m) => [m.moduleName, m.status]));
  }
}
