import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingStatusDto } from './dto/booking.dto';
import { MatchingService } from '../matching/matching.service';
import { NotificationGateway } from '../notification/notification.gateway';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matchingService: MatchingService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createBooking(customerId: string, dto: CreateBookingDto) {
    const category = await this.prisma.serviceCategory.findUnique({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    const totalAmount = category.basePrice * (dto.estimatedHours || 1);

    const booking = await this.prisma.booking.create({
      data: {
        customerId,
        categoryId: dto.categoryId,
        address: dto.address,
        latitude: dto.latitude,
        longitude: dto.longitude,
        estimatedHours: dto.estimatedHours,
        totalAmount,
        status: 'MATCHING',
      },
    });

    // Fire-and-forget: start the auto-matching engine
    this.matchingService.findAndAssignWorker(booking).catch((err) => {
      console.error(`❌ Matching engine error for booking ${booking.id}:`, err);
    });

    return booking;
  }

  async getCustomerBookings(customerId: string) {
    return this.prisma.booking.findMany({
      where: { customerId },
      include: { worker: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWorkerBookingsByUserId(userId: string) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { userId } });
    if (!profile) return [];
    return this.prisma.booking.findMany({
      where: { workerId: profile.id },
      include: { customer: true, category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBooking(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { customer: true, worker: true, category: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async updateStatus(bookingId: string, dto: UpdateBookingStatusDto) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: dto.status },
    });
  }

  async acceptBooking(workerId: string, bookingId: string) {
    const profile = await this.prisma.workerProfile.findUnique({ where: { userId: workerId } });
    if (!profile) throw new NotFoundException('Worker profile not found');

    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    
    if (booking.status !== 'PENDING' && booking.status !== 'MATCHING') {
      throw new BadRequestException('Booking is no longer available');
    }

    // Simplification for MVP: worker accepts by claiming workerId
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'ACCEPTED',
        workerId: profile.id
      },
    });

    // Emit real-time booking status update via WebSocket
    this.notificationGateway.emitToUser(booking.customerId, 'booking:status', {
      bookingId,
      status: 'ACCEPTED',
      workerId: profile.id,
    });

    return updated;
  }

  async declineBooking(workerId: string, bookingId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Can only decline a PENDING booking');
    }

    // For MVP: we just cancel it and let customer try again
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'CANCELLED',
        description: reason ? `Declined by worker: ${reason}` : 'Declined by worker'
      },
    });
  }

  async cancelBooking(userId: string, bookingId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED') {
      throw new BadRequestException('Cannot cancel a completed or already cancelled booking');
    }

    // For MVP: basic cancellation, no penalties enforced yet
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { 
        status: 'CANCELLED',
        description: reason ? `Cancelled: ${reason}` : 'Cancelled'
      },
    });
  }
}
