import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async createRazorpayOrder(userId: string, bookingId: string, amount: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    
    // For MVP, we mock Razorpay order creation
    const mockOrderId = 'order_' + Math.random().toString(36).substring(7);
    
    await this.prisma.payment.create({
      data: {
        bookingId,
        amount,
        status: 'PENDING',
        transactionId: mockOrderId,
        method: 'UPI'
      }
    });

    return {
      orderId: mockOrderId,
      amount,
      currency: 'INR'
    };
  }

  async handleWebhook(signature: string, body: any) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_secret';
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new BadRequestException('Invalid webhook signature');
    }

    console.log('Webhook received:', body.event);
    
    if (body.event === 'payment.captured' && body.payload?.payment?.entity) {
      const entity = body.payload.payment.entity;
      const orderId = entity.order_id;
      
      const payment = await this.prisma.payment.findFirst({
        where: { transactionId: orderId }
      });

      if (payment) {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS' }
        });

        await this.prisma.booking.update({
          where: { id: payment.bookingId },
          data: { status: 'COMPLETED' }
        });
      }
    }
    return { status: 'ok' };
  }
}
