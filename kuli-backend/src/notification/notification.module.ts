import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from '../redis/redis.module';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { FcmService } from './fcm.service';

@Module({
  imports: [RedisModule, JwtModule, ConfigModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGateway, FcmService],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
