import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
    }
}

@Controller('wallet')
@UseGuards(JwtAuthGuard)
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get()
    async getBalance(@Request() req: AuthenticatedRequest) {
        return this.walletService.getBalance(req.user.userId);
    }

    @Get('transactions')
    async getHistory(@Request() req: AuthenticatedRequest, @Query('limit') limit: number) {
        return this.walletService.getTransactions(req.user.userId, limit);
    }

    @Post('add-money')
    async addMoney(@Request() req: AuthenticatedRequest, @Body() body: { amount: number; paymentId: string }) {
        // In production, Validate paymentId with Razorpay first
        return this.walletService.addMoney(req.user.userId, body.amount, body.paymentId);
    }
}
