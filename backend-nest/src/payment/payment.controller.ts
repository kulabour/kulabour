import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('create-order')
    @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
    // @UseGuards(JwtAuthGuard)
    createOrder(@Body() createOrderDto: CreateOrderDto, @Request() req: any) {
        // Mock user for now if guard disabled
        const user = req.user || { userId: 'mock-user-id' };
        return this.paymentService.createOrder(createOrderDto.amount, createOrderDto.bookingId);
    }

    @Post('verify')
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute (more strict)
    verifyPayment(@Body() verifyPaymentDto: VerifyPaymentDto) {
        return this.paymentService.verifyPaymentSignature(
            verifyPaymentDto.orderId,
            verifyPaymentDto.paymentId,
            verifyPaymentDto.signature
        );
    }
}
