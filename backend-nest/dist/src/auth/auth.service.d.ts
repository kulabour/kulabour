import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private usersService;
    private jwtService;
    private otpStore;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(mobile: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: any;
    }>;
    validateAdmin(email: string, pass: string): Promise<any>;
    sendOtp(phone: string): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(phone: string, otp: string, role?: string, name?: string): Promise<{
        access_token: string;
        user: any;
    }>;
}
