import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { MatchingModule } from '../matching/matching.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [MatchingModule, NotificationModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
