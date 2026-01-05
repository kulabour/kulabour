import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { WorkersService } from '../workers/workers.service';
export declare class BookingsService {
    private bookingModel;
    private workersService;
    constructor(bookingModel: Model<BookingDocument>, workersService: WorkersService);
    create(createBookingDto: any, user: any): Promise<Booking>;
    findAll(): Promise<Booking[]>;
    findOne(id: string): Promise<BookingDocument>;
    countTotal(): Promise<number>;
    getTotalRevenue(): Promise<number>;
    findRecent(limit?: number): Promise<Booking[]>;
}
