import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    // @UseGuards(JwtAuthGuard)
    create(@Body() createBookingDto: CreateBookingDto, @Request() req: any) {
        // Mock user
        const user = req.user || { userId: 'mock-customer-id', name: 'Mock Customer' };
        return this.bookingsService.create(createBookingDto, user);
    }

    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookingsService.findOne(id);
    }
}
