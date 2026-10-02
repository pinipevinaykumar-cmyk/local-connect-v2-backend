import {
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
  IsOptional,
  IsInt,
  IsPositive,
} from 'class-validator';

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
  password: string;

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
