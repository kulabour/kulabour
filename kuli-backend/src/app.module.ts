import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from './prisma/prisma.module';
import { BookingModule } from './booking/booking.module';
import { WorkerModule } from './worker/worker.module';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { TrackingModule } from './tracking/tracking.module';
import { SearchModule } from './search/search.module';
import { PaymentModule } from './payment/payment.module';
import { ReviewModule } from './review/review.module';
import { ChatModule } from './chat/chat.module';
import { MatchingModule } from './matching/matching.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    // Global config — loads .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Core infrastructure
    PrismaModule,
    RedisModule,

    // Feature modules
    BookingModule,
    WorkerModule,
    AuthModule,
    SmsModule,
    TrackingModule,
    SearchModule,
    PaymentModule,
    ReviewModule,
    ChatModule,
    MatchingModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
