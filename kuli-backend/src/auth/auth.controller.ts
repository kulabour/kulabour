import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Ip,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SendOtpDto, VerifyOtpDto, RefreshTokenDto, LogoutDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/send-otp
   * Send a 4-digit OTP to the given Indian mobile number.
   * Rate limited: max 5 requests per 10 minutes per number.
   */
  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  async sendOTP(@Body() dto: SendOtpDto, @Ip() ip: string) {
    return this.authService.sendOTP(dto, ip);
  }

  /**
   * POST /auth/verify-otp
   * Verify the OTP and receive JWT access + refresh tokens.
   * Creates user account if first login.
   */
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOTP(dto);
  }

  /**
   * POST /auth/refresh
   * Use a valid refresh token to obtain a new access token.
   * Protected — requires valid JWT (any).
   */
  @Post('refresh')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req: { user: { sub: string } }, @Body() dto: RefreshTokenDto) {
    return this.authService.refresh(req.user.sub, dto);
  }

  /**
   * POST /auth/logout
   * Invalidate the current device session in Redis.
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: { user: { sub: string } }, @Body() dto: LogoutDto) {
    return this.authService.logout(req.user.sub, dto);
  }
}
