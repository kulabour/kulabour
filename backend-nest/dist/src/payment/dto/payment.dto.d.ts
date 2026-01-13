export declare class CreateOrderDto {
    bookingId: string;
    amount: number;
}
export declare class VerifyPaymentDto {
    orderId: string;
    paymentId: string;
    signature: string;
    bookingId: string;
}
