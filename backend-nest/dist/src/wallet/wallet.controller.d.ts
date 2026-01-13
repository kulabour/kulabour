import { WalletService } from './wallet.service';
interface AuthenticatedRequest extends Request {
    user: {
        userId: string;
        email: string;
    };
}
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getBalance(req: AuthenticatedRequest): Promise<import("./wallet.schema").Wallet>;
    getHistory(req: AuthenticatedRequest, limit: number): Promise<import("./wallet.schema").Transaction[]>;
    addMoney(req: AuthenticatedRequest, body: {
        amount: number;
        paymentId: string;
    }): Promise<import("./wallet.schema").Wallet>;
}
export {};
