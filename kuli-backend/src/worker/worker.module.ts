import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [WorkerController],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
