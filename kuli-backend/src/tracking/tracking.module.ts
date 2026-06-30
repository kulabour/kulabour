import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { AdaptiveTrackingService } from './adaptive-tracking.service';
import { TrackingService } from './tracking.service';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [AdaptiveTrackingService, TrackingService],
  exports: [AdaptiveTrackingService, TrackingService],
})
export class TrackingModule {}
