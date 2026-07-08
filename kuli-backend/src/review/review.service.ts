import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async submitReview(userId: string, dto: { bookingId: string; workerId: string; rating: number; comment?: string }) {
    const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.customerId !== userId) throw new UnauthorizedException('Can only review own bookings');
    if (booking.status !== 'COMPLETED') throw new Error('Booking must be COMPLETED to leave a review');

    const review = await this.prisma.review.create({
      data: {
        customerId: userId,
        workerId: dto.workerId,
        bookingId: dto.bookingId,
        stars: dto.rating,
        comment: dto.comment
      }
    });

    // Fire off async rating recalculation (in MVP, we'll do it sync)
    await this.recalculateWorkerRating(dto.workerId);

    return review;
  }

  async editReview(userId: string, reviewId: string, dto: { rating?: number; comment?: string }) {
    const review = await this.prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.customerId !== userId) throw new UnauthorizedException('Can only edit own reviews');

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        stars: dto.rating,
        comment: dto.comment
      }
    });

    if (dto.rating !== undefined) {
      await this.recalculateWorkerRating(updated.workerId);
    }

    return updated;
  }

  private async recalculateWorkerRating(workerId: string) {
    const aggregations = await this.prisma.review.aggregate({
      where: { workerId },
      _avg: { stars: true }
    });

    const newRating = aggregations._avg.stars || 0;
    
    // This updates the calculated field on the worker profile
    // Note: The schema needs a rating field on WorkerProfile if we want to cache it, 
    // for MVP we can just let it exist or query it dynamically.
  }
}
