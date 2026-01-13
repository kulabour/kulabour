import { IsString, IsNumber, Min, Max, IsMongoId } from 'class-validator';

export class CreateOrderDto {
    @IsMongoId()
    bookingId: string;

    @IsNumber()
    @Min(1)
    @Max(100000)
    amount: number;
}

export class VerifyPaymentDto {
    @IsString()
    orderId: string;

    @IsString()
    paymentId: string;

    @IsString()
    signature: string;

    @IsMongoId()
    bookingId: string;
}
