import { Model } from 'mongoose';
import { Wallet, WalletDocument, Transaction, TransactionDocument } from './wallet.schema';
export declare class WalletService {
    private walletModel;
    private transactionModel;
    constructor(walletModel: Model<WalletDocument>, transactionModel: Model<TransactionDocument>);
    createWallet(userId: string): Promise<Wallet>;
    getBalance(userId: string): Promise<Wallet>;
    getTransactions(userId: string, limit?: number): Promise<Transaction[]>;
    addMoney(userId: string, amount: number, paymentId: string): Promise<Wallet>;
    processPayment(userId: string, amount: number, bookingId: string): Promise<Wallet>;
    creditWorkerEarning(userId: string, amount: number, jobId: string): Promise<Wallet>;
}
