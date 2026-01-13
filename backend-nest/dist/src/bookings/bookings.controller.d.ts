import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(createBookingDto: CreateBookingDto, req: any): Promise<import("./schemas/booking.schema").Booking>;
    findAll(): Promise<import("./schemas/booking.schema").Booking[]>;
    findOne(id: string): Promise<import("./schemas/booking.schema").BookingDocument>;
}
