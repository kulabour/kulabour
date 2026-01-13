import { Document } from 'mongoose';
export type BookingDocument = Booking & Document;
export declare class PaymentDetails {
    orderId: string;
    paymentId: string;
    status: string;
    paidAt: Date;
    refundId?: string;
    refundAmount: number;
    refundReason?: string;
}
export declare class Booking {
    serviceId: string;
    serviceName: string;
    customerId: string;
    customerName: string;
    workerId: string;
    workerName: string;
    address: string;
    scheduledTime: Date;
    totalAmount: number;
    status: string;
    payment: PaymentDetails;
}
export declare const BookingSchema: import("mongoose").Schema<Booking, import("mongoose").Model<Booking, any, any, any, Document<unknown, any, Booking, any, {}> & Booking & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Booking, Document<unknown, {}, import("mongoose").FlatRecord<Booking>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Booking> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
