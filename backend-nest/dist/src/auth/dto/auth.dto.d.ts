export declare class LoginDto {
    mobile: string;
    password: string;
}
export declare class SendOtpDto {
    mobile: string;
}
export declare class VerifyOtpDto {
    mobile: string;
    otp: string;
    role?: string;
    name?: string;
}
