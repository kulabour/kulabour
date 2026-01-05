import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay = require('razorpay');

@Injectable()
export class PaymentService {
    private razorpay: any;

    constructor(private configService: ConfigService) {
        this.razorpay = new Razorpay({
            key_id: this.configService.get('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
        });
    }

    /**
     * Create a new payment order
     */
    async createOrder(amount: number, bookingId: string) {
        try {
            const options = {
                amount: amount * 100, // Convert to paise
                currency: 'INR',
                receipt: `booking_${bookingId}`,
                notes: {
                    bookingId,
                },
            };

            const order = await this.razorpay.orders.create(options);

            return {
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
            };
        } catch (error: any) {
            console.error('Payment order creation failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Verify payment signature
     */
    verifyPaymentSignature(
        orderId: string,
        paymentId: string,
        signature: string
    ): boolean {
        try {
            const crypto = require('crypto');
            const text = `${orderId}|${paymentId}`;
            const secret = this.configService.get('RAZORPAY_KEY_SECRET');

            const generatedSignature = crypto
                .createHmac('sha256', secret)
                .update(text)
                .digest('hex');

            return generatedSignature === signature;
        } catch (error: any) {
            console.error('Payment verification failed:', error);
            return false;
        }
    }

    /**
     * Capture payment
     */
    async capturePayment(paymentId: string, amount: number) {
        try {
            const payment = await this.razorpay.payments.capture(
                paymentId,
                amount * 100,
                'INR'
            );

            return {
                success: true,
                payment,
            };
        } catch (error: any) {
            console.error('Payment capture failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Initiate refund
     */
    async refundPayment(paymentId: string, amount?: number) {
        try {
            const refund = await this.razorpay.payments.refund(paymentId, {
                amount: amount ? amount * 100 : undefined,
            });

            return {
                success: true,
                refund,
            };
        } catch (error: any) {
            console.error('Refund failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    /**
     * Get payment details
     */
    async getPaymentDetails(paymentId: string) {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);
            return {
                success: true,
                payment,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
