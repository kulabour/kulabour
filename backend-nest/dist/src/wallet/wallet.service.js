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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const wallet_schema_1 = require("./wallet.schema");
let WalletService = class WalletService {
    constructor(walletModel, transactionModel) {
        this.walletModel = walletModel;
        this.transactionModel = transactionModel;
    }
    async createWallet(userId) {
        const existing = await this.walletModel.findOne({ userId });
        if (existing)
            return existing;
        const created = await this.walletModel.create({ userId });
        return created;
    }
    async getBalance(userId) {
        let wallet = await this.walletModel.findOne({ userId });
        if (!wallet) {
            wallet = await this.createWallet(userId);
        }
        return wallet;
    }
    async getTransactions(userId, limit = 20) {
        const wallet = await this.getBalance(userId);
        const walletId = wallet._id;
        return this.transactionModel.find({ walletId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
    async addMoney(userId, amount, paymentId) {
        const wallet = await this.getBalance(userId);
        const walletId = wallet._id;
        const session = await this.walletModel.db.startSession();
        session.startTransaction();
        try {
            await this.transactionModel.create([{
                    walletId: walletId,
                    amount,
                    type: wallet_schema_1.TransactionType.CREDIT,
                    source: wallet_schema_1.TransactionSource.DEPOSIT,
                    status: wallet_schema_1.TransactionStatus.SUCCESS,
                    referenceId: paymentId,
                    description: 'Added money to wallet',
                }], { session });
            const updatedWallet = await this.walletModel.findOneAndUpdate({ _id: walletId }, { $inc: { balance: amount } }, { new: true, session });
            await session.commitTransaction();
            return updatedWallet;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async processPayment(userId, amount, bookingId) {
        const wallet = await this.getBalance(userId);
        const walletId = wallet._id;
        if (wallet.balance < amount) {
            throw new common_1.BadRequestException('Insufficient wallet balance');
        }
        const session = await this.walletModel.db.startSession();
        session.startTransaction();
        try {
            await this.transactionModel.create([{
                    walletId: walletId,
                    amount,
                    type: wallet_schema_1.TransactionType.DEBIT,
                    source: wallet_schema_1.TransactionSource.PAYMENT,
                    status: wallet_schema_1.TransactionStatus.SUCCESS,
                    referenceId: bookingId,
                    description: `Payment for booking #${bookingId}`,
                }], { session });
            const updatedWallet = await this.walletModel.findOneAndUpdate({ _id: walletId }, { $inc: { balance: -amount } }, { new: true, session });
            await session.commitTransaction();
            return updatedWallet;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    async creditWorkerEarning(userId, amount, jobId) {
        const wallet = await this.getBalance(userId);
        const walletId = wallet._id;
        const session = await this.walletModel.db.startSession();
        session.startTransaction();
        try {
            await this.transactionModel.create([{
                    walletId: walletId,
                    amount,
                    type: wallet_schema_1.TransactionType.CREDIT,
                    source: wallet_schema_1.TransactionSource.EARNING,
                    status: wallet_schema_1.TransactionStatus.SUCCESS,
                    referenceId: jobId,
                    description: `Payout for job #${jobId}`,
                }], { session });
            const updatedWallet = await this.walletModel.findOneAndUpdate({ _id: walletId }, { $inc: { balance: amount } }, { new: true, session });
            await session.commitTransaction();
            return updatedWallet;
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(wallet_schema_1.Wallet.name)),
    __param(1, (0, mongoose_1.InjectModel)(wallet_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], WalletService);
//# sourceMappingURL=wallet.service.js.map