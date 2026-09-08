import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsPositive,
  IsEnum,
  Matches,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ShopStatus } from '@prisma/client';

export class CreateBusinessDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  ownerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be exactly 10 digits' })
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{10}$/, { message: 'WhatsApp must be exactly 10 digits' })
  whatsapp?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  address?: string;

  @IsOptional()
  @IsEnum(ShopStatus)
  status?: ShopStatus;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'openTime must be in HH:MM format' })
  openTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'closeTime must be in HH:MM format' })
  closeTime?: string;

  @IsOptional()
  @IsBoolean()
  is24Hours?: boolean;

  @IsOptional()
  @IsBoolean()
  hasDelivery?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  coverUrl?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  categoryId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  districtId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  mandalId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  villageId?: number;
}
