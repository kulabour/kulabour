import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserConversations(userId: string) {
    // For MVP, conversations are just active bookings
    const customerBookings = await this.prisma.booking.findMany({
      where: { customerId: userId },
      include: { worker: { include: { user: true } } },
      orderBy: { updatedAt: 'desc' }
    });

    const workerProfile = await this.prisma.workerProfile.findUnique({ where: { userId } });
    let workerBookings: any[] = [];
    if (workerProfile) {
      workerBookings = await this.prisma.booking.findMany({
        where: { workerId: workerProfile.id },
        include: { customer: true },
        orderBy: { updatedAt: 'desc' }
      });
    }

    return {
      customerConversations: customerBookings,
      workerConversations: workerBookings
    };
  }

  async getMessages(userId: string, bookingId: string, page: number, limit: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { worker: true }
    });

    if (!booking) throw new NotFoundException('Conversation/Booking not found');

    const isCustomer = booking.customerId === userId;
    const isWorker = booking.worker?.userId === userId;

    if (!isCustomer && !isWorker) {
      throw new UnauthorizedException('You do not have access to this conversation');
    }

    // Since we don't have a Message model yet in the MVP Prisma schema, 
    // we'll return an empty array for now. Real chat history requires a Message table.
    return {
      messages: [],
      page,
      limit,
      total: 0
    };
  }
}
