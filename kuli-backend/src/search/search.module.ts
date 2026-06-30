import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { SmartSearchService } from './smart-search.service';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [SmartSearchService],
  exports: [SmartSearchService],
})
export class SearchModule {}
