import { Controller, Post, Body, UseGuards, Request, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('pre-authorize')
  @UseGuards(AuthGuard('jwt'))
  async preAuthorize(@Request() req: any, @Body() dto: { bookingId: string, amount: number }) {
    if (!dto.bookingId || !dto.amount) {
      throw new Error('bookingId and amount are required');
    }
    return this.paymentService.createRazorpayOrder(req.user.sub, dto.bookingId, dto.amount);
  }

  @Post('webhook')
  async razorpayWebhook(@Headers('x-razorpay-signature') signature: string, @Body() body: any) {
    if (!signature) {
      throw new Error('Missing signature');
    }
    return this.paymentService.handleWebhook(signature, body);
  }
}
