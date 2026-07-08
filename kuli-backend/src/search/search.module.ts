import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { SmartSearchService } from './smart-search.service';
import { SearchController } from './search.controller';

@Module({
  imports: [ConfigModule, RedisModule],
  controllers: [SearchController],
  providers: [SmartSearchService],
  exports: [SmartSearchService],
})
export class SearchModule {}
