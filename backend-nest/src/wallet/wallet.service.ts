import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { Wallet, WalletDocument, Transaction, TransactionDocument, TransactionType, TransactionSource, TransactionStatus } from './wallet.schema';

@Injectable()
export class WalletService {
    constructor(
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) { }

    async createWallet(userId: string): Promise<Wallet> {
        const existing = await this.walletModel.findOne({ userId });
        if (existing) return existing as Wallet; // explicit cast
        const created = await this.walletModel.create({ userId });
        return created as Wallet;
    }

    async getBalance(userId: string): Promise<Wallet> {
        let wallet = await this.walletModel.findOne({ userId });
        if (!wallet) {
            wallet = await this.createWallet(userId) as any;
        }
        return wallet as Wallet;
    }

    async getTransactions(userId: string, limit: number = 20): Promise<Transaction[]> {
        const wallet = await this.getBalance(userId);
        const walletId = (wallet as any)._id;

        return this.transactionModel.find({ walletId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }

    async addMoney(userId: string, amount: number, paymentId: string): Promise<Wallet> {
        const wallet = await this.getBalance(userId);
        const walletId = (wallet as any)._id;

        const session = await this.walletModel.db.startSession();
        session.startTransaction();

        try {
            await this.transactionModel.create([{
                walletId: walletId,
                amount,
                type: TransactionType.CREDIT,
                source: TransactionSource.DEPOSIT,
                status: TransactionStatus.SUCCESS,
                referenceId: paymentId,
                description: 'Added money to wallet',
            }], { session });

            const updatedWallet = await this.walletModel.findOneAndUpdate(
                { _id: walletId },
                { $inc: { balance: amount } },
                { new: true, session }
            );

            await session.commitTransaction();
            return updatedWallet as Wallet;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async processPayment(userId: string, amount: number, bookingId: string): Promise<Wallet> {
        const wallet = await this.getBalance(userId);
        const walletId = (wallet as any)._id;

        if (wallet.balance < amount) {
            throw new BadRequestException('Insufficient wallet balance');
        }

        const session = await this.walletModel.db.startSession();
        session.startTransaction();

        try {
            await this.transactionModel.create([{
                walletId: walletId,
                amount,
                type: TransactionType.DEBIT,
                source: TransactionSource.PAYMENT,
                status: TransactionStatus.SUCCESS,
                referenceId: bookingId,
                description: `Payment for booking #${bookingId}`,
            }], { session });

            const updatedWallet = await this.walletModel.findOneAndUpdate(
                { _id: walletId },
                { $inc: { balance: -amount } },
                { new: true, session }
            );

            await session.commitTransaction();
            return updatedWallet as Wallet;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async creditWorkerEarning(userId: string, amount: number, jobId: string): Promise<Wallet> {
        const wallet = await this.getBalance(userId);
        const walletId = (wallet as any)._id;

        const session = await this.walletModel.db.startSession();
        session.startTransaction();

        try {
            await this.transactionModel.create([{
                walletId: walletId,
                amount,
                type: TransactionType.CREDIT,
                source: TransactionSource.EARNING,
                status: TransactionStatus.SUCCESS,
                referenceId: jobId,
                description: `Payout for job #${jobId}`,
            }], { session });

            const updatedWallet = await this.walletModel.findOneAndUpdate(
                { _id: walletId },
                { $inc: { balance: amount } },
                { new: true, session }
            );

            await session.commitTransaction();
            return updatedWallet as Wallet;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
