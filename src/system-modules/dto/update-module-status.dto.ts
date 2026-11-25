import { IsEnum } from 'class-validator';
import { ModuleStatus } from '@prisma/client';

export class UpdateModuleStatusDto {
  @IsEnum(ModuleStatus)
  status: ModuleStatus;
}
