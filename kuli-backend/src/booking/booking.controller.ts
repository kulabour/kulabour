import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';

@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async createBooking(@Request() req: any, @Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(req.user.sub, dto);
  }

  @Get()
  async getMyBookings(@Request() req: any) {
    if (req.user.role === 'CUSTOMER') {
      return this.bookingService.getCustomerBookings(req.user.sub);
    } else {
      return this.bookingService.getWorkerBookingsByUserId(req.user.sub);
    }
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    return this.bookingService.getBooking(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingService.updateStatus(id, dto);
  }

  @Post(':id/accept')
  async acceptBooking(@Request() req: any, @Param('id') id: string) {
    return this.bookingService.acceptBooking(req.user.sub, id);
  }

  @Post(':id/decline')
  async declineBooking(@Request() req: any, @Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingService.declineBooking(req.user.sub, id, reason);
  }

  @Post(':id/cancel')
  async cancelBooking(@Request() req: any, @Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingService.cancelBooking(req.user.sub, id, reason);
  }
}
