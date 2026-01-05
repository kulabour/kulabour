import { PaymentService } from './payment.service';
import { CreateOrderDto, VerifyPaymentDto } from './dto/payment.dto';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createOrder(createOrderDto: CreateOrderDto, req: any): Promise<{
        success: boolean;
        orderId: any;
        amount: any;
        currency: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        orderId?: undefined;
        amount?: undefined;
        currency?: undefined;
    }>;
    verifyPayment(verifyPaymentDto: VerifyPaymentDto): boolean;
}
