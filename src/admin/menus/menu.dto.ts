import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsBoolean, IsInt, IsOptional, IsString, Matches, MaxLength, ValidateNested } from 'class-validator';

export class CreateMenuDto {
  @IsString() @MaxLength(60) label!: string;
  @IsString() @Matches(/^[a-z0-9_]+$/) @MaxLength(60) slug!: string;
  @IsString() @MaxLength(200) url!: string;
  @IsOptional() @IsString() @MaxLength(40) icon?: string;
  @IsOptional() @IsString() @MaxLength(40) section?: string;
  @IsOptional() @IsString() @MaxLength(60) moduleKey?: string;
  @IsOptional() @IsInt() parentId?: number | null;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() isEnabled?: boolean;
  @IsOptional() @IsArray() @IsInt({ each: true }) roleIds?: number[];
}

export class UpdateMenuDto {
  @IsOptional() @IsString() @MaxLength(60) label?: string;
  @IsOptional() @IsString() @MaxLength(200) url?: string;
  @IsOptional() @IsString() @MaxLength(40) icon?: string;
  @IsOptional() @IsString() @MaxLength(40) section?: string;
  @IsOptional() @IsString() @MaxLength(60) moduleKey?: string;
  @IsOptional() @IsInt() parentId?: number | null;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() isEnabled?: boolean;
  @IsOptional() @IsArray() @IsInt({ each: true }) roleIds?: number[];
}

class ReorderItem {
  @IsInt() id!: number;
  @IsOptional() @IsInt() parentId?: number | null;
  @IsInt() order!: number;
  @IsOptional() @IsString() section?: string;
}

export class ReorderMenusDto {
  @IsArray() @ArrayMaxSize(500) @ValidateNested({ each: true }) @Type(() => ReorderItem)
  items!: ReorderItem[];
}
