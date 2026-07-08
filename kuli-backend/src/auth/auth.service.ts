import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../prisma/prisma.service';
import { SmsGatewayService } from '../sms/sms-gateway.service';
import { DeviceTrustService } from './device-trust.service';
import * as crypto from 'crypto';
import { SendOtpDto, VerifyOtpDto, RefreshTokenDto, LogoutDto } from './dto/auth.dto';

const OTP_MAX_ATTEMPTS = 5;
const OTP_EXPIRY_SECONDS = 300;

@Injectable()
export class AuthService {
  constructor(
    private readonly redis: RedisService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly smsGateway: SmsGatewayService,
    private readonly deviceTrust: DeviceTrustService,
  ) {}

  // ─── Generate a cryptographically random 4-digit OTP ──────────────────────

  private generateOTP(): string {
    // Generate a number between 1000 and 9999
    const otp = crypto.randomInt(1000, 9999);
    return otp.toString();
  }

  // ─── Send OTP ──────────────────────────────────────────────────────────────

  async sendOTP(dto: SendOtpDto, clientIp: string): Promise<{ message: string; expiresIn?: number; bypassed?: boolean; accessToken?: string; refreshToken?: string; user?: any }> {
    const { phone, deviceId, deviceToken } = dto;

    // Device trust check (Skip OTP if trusted)
    if (deviceId && deviceToken) {
      const trust = await this.deviceTrust.verifyDeviceTrust(phone, deviceId, deviceToken);
      if (trust.trusted) {
        let user = await this.prisma.user.findUnique({ where: { phoneNumber: phone } });
        if (!user) {
          user = await this.prisma.user.create({ data: { phoneNumber: phone } });
        }
        const { accessToken, refreshToken } = await this.issueTokens(user.id, user.role, deviceId);
        return {
          message: 'Device trusted. Login successful.',
          bypassed: true,
          accessToken,
          refreshToken,
          user: { id: user.id, phone: user.phoneNumber, role: user.role, isNewUser: false },
        };
      }
    }

    // Rate-limit check: max 5 attempts per 10 minutes
    const attempts = await this.redis.getOTPAttempts(phone);
    if (attempts >= OTP_MAX_ATTEMPTS) {
      throw new ForbiddenException(
        'Too many OTP requests. Please wait 10 minutes before trying again.',
      );
    }

    const otp = this.generateOTP();

    // Store OTP in Redis with TTL
    await this.redis.setOTP(phone, otp);

    const smsResult = await this.smsGateway.sendOTP(phone, otp, clientIp);
    if (!smsResult.success && smsResult.channel !== 'console') {
      throw new BadRequestException(smsResult.error || 'Failed to send OTP.');
    }

    return {
      message: `OTP sent to ${phone}. Valid for ${OTP_EXPIRY_SECONDS / 60} minutes.`,
      expiresIn: OTP_EXPIRY_SECONDS,
    };
  }

  // ─── Verify OTP & Issue Tokens ─────────────────────────────────────────────

  async verifyOTP(dto: VerifyOtpDto): Promise<{
    accessToken: string;
    refreshToken: string;
    deviceToken: string;
    user: {
      id: string;
      phone: string;
      role: string;
      isNewUser: boolean;
    };
  }> {
    const { phone, otp, deviceId, deviceName, platform } = dto;

    // Retrieve stored OTP from Redis
    const storedOTP = await this.redis.getOTP(phone);

    if (!storedOTP) {
      throw new UnauthorizedException('OTP has expired. Please request a new one.');
    }

    if (storedOTP !== otp) {
      throw new UnauthorizedException('Invalid OTP. Please try again.');
    }

    // OTP verified — clean up Redis
    await this.redis.deleteOTP(phone);
    await this.redis.clearOTPAttempts(phone);

    // Find or create user in the database
    let user = await this.prisma.user.findUnique({ where: { phoneNumber: phone } });
    const isNewUser = !user;

    if (!user) {
      user = await this.prisma.user.create({
        data: { phoneNumber: phone },
      });
    }

    // Issue JWTs
    const { accessToken, refreshToken } = await this.issueTokens(user.id, user.role, deviceId);
    
    // Register trusted device
    const { deviceToken } = await this.deviceTrust.registerTrustedDevice(
      phone,
      deviceId,
      deviceName || 'Unknown Device',
      platform || 'android',
    );

    return {
      accessToken,
      refreshToken,
      deviceToken,
      user: {
        id: user.id,
        phone: user.phoneNumber,
        role: user.role,
        isNewUser,
      },
    };
  }

  // ─── Refresh Access Token ──────────────────────────────────────────────────

  async refresh(userId: string, dto: RefreshTokenDto): Promise<{ accessToken: string }> {
    const { refreshToken, deviceId } = dto;

    // Verify the token is valid
    let payload: { sub: string; role: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET', 'kuli-refresh-secret-dev'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }

    // Check session is still valid in Redis
    const storedHash = await this.redis.getSession(userId, deviceId);
    const incomingHash = this.hashToken(refreshToken);

    if (!storedHash || storedHash !== incomingHash) {
      throw new UnauthorizedException('Session not found or revoked. Please login again.');
    }

    // Issue a new access token
    const accessToken = this.jwtService.sign(
      { sub: payload.sub, role: payload.role },
      {
        secret: this.config.get<string>('JWT_ACCESS_SECRET', 'kuli-access-secret-dev'),
        expiresIn: '15m',
      },
    );

    return { accessToken };
  }

  // ─── Logout ────────────────────────────────────────────────────────────────

  async logout(userId: string, dto: LogoutDto): Promise<{ message: string }> {
    await this.redis.deleteSession(userId, dto.deviceId);
    return { message: 'Logged out successfully.' };
  }

  // ─── Token Helpers ─────────────────────────────────────────────────────────

  private async issueTokens(
    userId: string,
    role: string,
    deviceId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET', 'kuli-access-secret-dev'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET', 'kuli-refresh-secret-dev'),
      expiresIn: '7d',
    });

    // Store hashed refresh token in Redis for session validation
    await this.redis.setSession(userId, deviceId, this.hashToken(refreshToken));

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
