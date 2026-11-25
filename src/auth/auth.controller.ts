import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { successResponse } from '../common/response/api-response';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return successResponse(result, 'Registration successful');
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return successResponse(result, 'Login successful');
  }

  @Post('unlock-admin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async unlockAdmin(@Body('pin') pin: string, @CurrentUser() user: any) {
    const result = await this.authService.unlockAdmin(user.id, pin);
    return successResponse(result, 'Admin access granted');
  }
}
