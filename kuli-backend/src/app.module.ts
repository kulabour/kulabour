import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { TrackingModule } from './tracking/tracking.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    // Global config — loads .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core infrastructure
    RedisModule,

    // Feature modules
    AuthModule,
    SmsModule,
    TrackingModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
