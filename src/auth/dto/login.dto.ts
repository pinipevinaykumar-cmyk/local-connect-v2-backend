import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  phone: string; // phone number or username

  @IsString()
  @IsNotEmpty()
  password: string;
}
