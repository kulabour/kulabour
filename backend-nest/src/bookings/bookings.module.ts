import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { BookingsGateway } from './bookings.gateway';

import { BookingsController } from './bookings.controller';
import { WorkersModule } from '../workers/workers.module';
import { MockBookingModel } from './mocks/booking.model.mock';

const isMock = process.env.USE_MOCKS === 'true' || !process.env.MONGODB_URI;

@Module({
    imports: [
        ...(isMock
            ? []
            : [MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }])]),
        WorkersModule
    ],
    controllers: [BookingsController],
    providers: [
        BookingsService,
        BookingsGateway,
        ...(isMock
            ? [{
                provide: getModelToken(Booking.name),
                useValue: MockBookingModel
            }]
            : [])
    ],
    exports: [BookingsService],
})
export class BookingsModule { }
