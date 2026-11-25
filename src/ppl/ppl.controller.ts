import { Controller, Get, Post, Body, UseGuards, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { successResponse } from '../common/response/api-response';
import { PPL_REG_OPEN, PPL_REG_CLOSE, getRegStatus } from './ppl-schedule';

@Controller('ppl')
export class PplController {

  /** Public — current registration status + window info */
  @Get('registration-status')
  getRegistrationStatus() {
    const status = getRegStatus();
    return successResponse({
      status,
      opensAt:  PPL_REG_OPEN.toISOString(),
      closesAt: PPL_REG_CLOSE.toISOString(),
      serverTime: new Date().toISOString(),
    });
  }

  /** Protected — validate window before accepting a registration */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  submitRegistration(@Body() body: Record<string, unknown>, @CurrentUser() _user: any) {
    const status = getRegStatus();

    if (status === 'upcoming') {
      throw new BadRequestException(
        `Player Registration is not open yet. It opens on Nov 5, 2026 at 10:00 AM IST.`,
      );
    }
    if (status === 'closed') {
      throw new BadRequestException(
        `Player Registration has ended for PPL Season 2. Stay tuned for verification and auction updates.`,
      );
    }

    // Registration is open — acknowledge (real persistence wired separately)
    return successResponse(
      { received: true, submittedAt: new Date().toISOString() },
      'Registration received. You will be notified once verified.',
    );
  }
}
