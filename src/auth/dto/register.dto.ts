import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsEnum,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';
import { UserType } from '@prisma/client';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'Username must be at least 4 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be exactly 10 digits' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()\-+=])[A-Za-z\d@$!%*?&_#^()\-+=]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserType, { message: 'userType must be CUSTOMER, MERCHANT, or ADMIN' })
  userType?: UserType;

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
