import { Controller, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReviewService } from './review.service';

@Controller('reviews')
@UseGuards(AuthGuard('jwt'))
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async submitReview(
    @Request() req: any,
    @Body() dto: { bookingId: string; workerId: string; rating: number; comment?: string }
  ) {
    if (!dto.bookingId || !dto.workerId || dto.rating === undefined) {
      throw new Error('bookingId, workerId, and rating are required');
    }
    return this.reviewService.submitReview(req.user.sub, dto);
  }

  @Patch(':id')
  async editReview(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: { rating?: number; comment?: string }
  ) {
    return this.reviewService.editReview(req.user.sub, id, dto);
  }
}
