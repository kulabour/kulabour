import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { DeviceTrustService } from './device-trust.service';
import { RedisModule } from '../redis/redis.module';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    SmsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET', 'kuli-access-secret-dev'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy, DeviceTrustService],
  controllers: [AuthController],
  exports: [AuthService, DeviceTrustService, JwtModule, PassportModule],
})
export class AuthModule {}
