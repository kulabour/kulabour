import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsGatewayService } from './sms-gateway.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [SmsGatewayService],
  exports: [SmsGatewayService],
})
export class SmsModule {}
