import { ConfigService } from '@nestjs/config';
export declare class PaymentService {
    private configService;
    private razorpay;
    constructor(configService: ConfigService);
    createOrder(amount: number, bookingId: string): Promise<{
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
    verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
    capturePayment(paymentId: string, amount: number): Promise<{
        success: boolean;
        payment: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        payment?: undefined;
    }>;
    refundPayment(paymentId: string, amount?: number): Promise<{
        success: boolean;
        refund: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        refund?: undefined;
    }>;
    getPaymentDetails(paymentId: string): Promise<{
        success: boolean;
        payment: any;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        payment?: undefined;
    }>;
}
