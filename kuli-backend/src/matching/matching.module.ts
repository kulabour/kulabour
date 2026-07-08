import { Module, forwardRef } from '@nestjs/common';
import { RedisModule } from '../redis/redis.module';
import { NotificationModule } from '../notification/notification.module';
import { MatchingService } from './matching.service';

@Module({
  imports: [RedisModule, forwardRef(() => NotificationModule)],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
