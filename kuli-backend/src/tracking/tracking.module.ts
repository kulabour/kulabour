import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { AdaptiveTrackingService } from './adaptive-tracking.service';
import { TrackingGateway } from './tracking.gateway';
import { JwtModule } from '@nestjs/jwt';

import { TrackingController } from './tracking.controller';

@Module({
  imports: [RedisModule, JwtModule, ConfigModule],
  controllers: [TrackingController],
  providers: [AdaptiveTrackingService, TrackingGateway],
  exports: [AdaptiveTrackingService, TrackingGateway],
})
export class TrackingModule {}
