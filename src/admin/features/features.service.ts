import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

export class CreateFeatureDto {
  @Matches(/^[a-z0-9_.]+$/) @MaxLength(60) key!: string;
  @IsString() @MaxLength(80) name!: string;
  @IsOptional() @IsString() @MaxLength(300) description?: string;
  @IsOptional() @IsBoolean() isEnabled?: boolean;
}
export class UpdateFeatureDto {
  @IsOptional() @IsString() @MaxLength(80) name?: string;
  @IsOptional() @IsString() @MaxLength(300) description?: string;
  @IsOptional() @IsBoolean() isEnabled?: boolean;
}

type Actor = { id: number; username?: string };

@Injectable()
export class FeaturesService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  list() { return this.prisma.featureFlag.findMany({ orderBy: { key: 'asc' } }); }

  /** Public { key: boolean } map. Unknown keys must be treated as enabled by clients. */
  async map() {
    const rows = await this.list();
    return Object.fromEntries(rows.map((f) => [f.key, f.isEnabled]));
  }

  async create(dto: CreateFeatureDto, actor: Actor, ip?: string) {
    if (await this.prisma.featureFlag.findUnique({ where: { key: dto.key } }))
      throw new ConflictException('Feature key already exists');
    const f = await this.prisma.featureFlag.create({ data: { ...dto, updatedBy: actor.id } });
    await this.audit.log({ actor, action: 'create', module: 'features', entityId: f.key, after: f, ip });
    return f;
  }

  async update(id: number, dto: UpdateFeatureDto, actor: Actor, ip?: string) {
    const before = await this.prisma.featureFlag.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('Feature not found');
    const after = await this.prisma.featureFlag.update({ where: { id }, data: { ...dto, updatedBy: actor.id } });
    const action = dto.isEnabled !== undefined && dto.isEnabled !== before.isEnabled ? (dto.isEnabled ? 'enable' : 'disable') : 'update';
    await this.audit.log({ actor, action, module: 'features', entityId: before.key, before, after, ip });
    return after;
  }

  async remove(id: number, actor: Actor, ip?: string) {
    const before = await this.prisma.featureFlag.findUnique({ where: { id } });
    if (!before) throw new NotFoundException('Feature not found');
    await this.prisma.featureFlag.delete({ where: { id } });
    await this.audit.log({ actor, action: 'delete', module: 'features', entityId: before.key, before, ip });
  }
}
