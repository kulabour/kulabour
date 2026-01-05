import { Document, Schema as MongooseSchema } from 'mongoose';
export type WalletDocument = Wallet & Document;
export declare class Wallet {
    userId: string;
    balance: number;
    currency: string;
}
export declare const WalletSchema: MongooseSchema<Wallet, import("mongoose").Model<Wallet, any, any, any, Document<unknown, any, Wallet, any, {}> & Wallet & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Wallet, Document<unknown, {}, import("mongoose").FlatRecord<Wallet>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Wallet> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type TransactionDocument = Transaction & Document;
export declare enum TransactionType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
}
export declare enum TransactionSource {
    DEPOSIT = "DEPOSIT",
    PAYMENT = "PAYMENT",
    REFUND = "REFUND",
    EARNING = "EARNING",
    WITHDRAWAL = "WITHDRAWAL"
}
export declare enum TransactionStatus {
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}
export declare class Transaction {
    walletId: string;
    amount: number;
    type: TransactionType;
    source: TransactionSource;
    status: TransactionStatus;
    referenceId: string;
    description: string;
}
export declare const TransactionSchema: MongooseSchema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction, any, {}> & Transaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Transaction> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
