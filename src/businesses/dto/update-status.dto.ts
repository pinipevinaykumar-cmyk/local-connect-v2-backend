import { IsEnum, IsNotEmpty } from 'class-validator';
import { ShopStatus } from '@prisma/client';

export class UpdateStatusDto {
  @IsEnum(ShopStatus, { message: 'status must be OPEN, CLOSED, or BUSY' })
  @IsNotEmpty()
  status: ShopStatus;
}
