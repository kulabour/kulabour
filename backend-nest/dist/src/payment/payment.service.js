"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Razorpay = require("razorpay");
let PaymentService = class PaymentService {
    constructor(configService) {
        this.configService = configService;
        this.razorpay = new Razorpay({
            key_id: this.configService.get('RAZORPAY_KEY_ID'),
            key_secret: this.configService.get('RAZORPAY_KEY_SECRET'),
        });
    }
    async createOrder(amount, bookingId) {
        try {
            const options = {
                amount: amount * 100,
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
        }
        catch (error) {
            console.error('Payment order creation failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    verifyPaymentSignature(orderId, paymentId, signature) {
        try {
            const crypto = require('crypto');
            const text = `${orderId}|${paymentId}`;
            const secret = this.configService.get('RAZORPAY_KEY_SECRET');
            const generatedSignature = crypto
                .createHmac('sha256', secret)
                .update(text)
                .digest('hex');
            return generatedSignature === signature;
        }
        catch (error) {
            console.error('Payment verification failed:', error);
            return false;
        }
    }
    async capturePayment(paymentId, amount) {
        try {
            const payment = await this.razorpay.payments.capture(paymentId, amount * 100, 'INR');
            return {
                success: true,
                payment,
            };
        }
        catch (error) {
            console.error('Payment capture failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async refundPayment(paymentId, amount) {
        try {
            const refund = await this.razorpay.payments.refund(paymentId, {
                amount: amount ? amount * 100 : undefined,
            });
            return {
                success: true,
                refund,
            };
        }
        catch (error) {
            console.error('Refund failed:', error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
    async getPaymentDetails(paymentId) {
        try {
            const payment = await this.razorpay.payments.fetch(paymentId);
            return {
                success: true,
                payment,
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map