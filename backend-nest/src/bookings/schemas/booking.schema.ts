import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookingDocument = Booking & Document;

@Schema()
export class PaymentDetails {
    @Prop() orderId: string;
    @Prop() paymentId: string;
    @Prop() status: string;
    @Prop() paidAt: Date;
    @Prop({ required: false }) refundId?: string;
    @Prop() refundAmount: number;
    @Prop({ required: false }) refundReason?: string;
}

@Schema({ timestamps: true })
export class Booking {
    @Prop({ required: true })
    serviceId: string;

    @Prop({ required: true })
    serviceName: string;

    @Prop({ required: true })
    customerId: string;

    @Prop({ required: true })
    customerName: string;

    @Prop()
    workerId: string;

    @Prop()
    workerName: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    scheduledTime: Date;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({
        required: true,
        enum: ['pending', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
    })
    status: string;

    @Prop({ type: PaymentDetails })
    payment: PaymentDetails;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
