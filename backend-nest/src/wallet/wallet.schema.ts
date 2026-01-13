import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true })
export class Wallet {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: string;

    @Prop({ default: 0 })
    balance: number;

    @Prop({ default: 'INR' })
    currency: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

export type TransactionDocument = Transaction & Document;

export enum TransactionType {
    CREDIT = 'CREDIT',
    DEBIT = 'DEBIT',
}

export enum TransactionSource {
    DEPOSIT = 'DEPOSIT',       // Added money via gateway
    PAYMENT = 'PAYMENT',       // Paid for service
    REFUND = 'REFUND',         // Refund from service
    EARNING = 'EARNING',       // Worker earning from job
    WITHDRAWAL = 'WITHDRAWAL', // Worker withdrawal
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Wallet', required: true })
    walletId: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true, enum: TransactionType })
    type: TransactionType;

    @Prop({ required: true, enum: TransactionSource })
    source: TransactionSource;

    @Prop({ required: true, enum: TransactionStatus, default: TransactionStatus.PENDING })
    status: TransactionStatus;

    @Prop()
    referenceId: string; // Razorpay Payment ID or Job ID

    @Prop()
    description: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
