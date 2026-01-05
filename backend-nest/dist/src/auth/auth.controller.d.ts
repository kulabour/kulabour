import { AuthService } from './auth.service';
import { LoginDto, SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    adminLogin(body: any): Promise<{
        access_token: string;
        user: any;
    }>;
    sendOtp(dto: SendOtpDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
        access_token: string;
        user: any;
    }>;
}
