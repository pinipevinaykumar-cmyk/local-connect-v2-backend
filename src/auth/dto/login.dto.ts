import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be exactly 10 digits' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
