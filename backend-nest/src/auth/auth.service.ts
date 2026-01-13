import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private otpStore = new Map<string, { otp: string; expires: number }>();

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(mobile: string, pass: string): Promise<any> {
        const user = await this.usersService.findByMobile(mobile);
        if (user) {
            return user;
        }
        return null;
    }

    async login(user: any) {
        const payload = { mobile: user.mobile, sub: user._id, role: user.userType || 'customer' };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }

    async validateAdmin(email: string, pass: string): Promise<any> {
        // MVP: Hardcoded admin check or Env vars
        // In production, fetch from DB where userType = 'admin'
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@kulabour.com';
        const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

        if (email === adminEmail && pass === adminPass) {
            return {
                _id: 'admin_id_123',
                mobile: '0000000000',
                userType: 'admin',
                name: 'Super Admin'
            };
        }
        return null;
    }

    async sendOtp(phone: string) {
        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Expiry 5 mins
        const expires = Date.now() + 5 * 60 * 1000;

        this.otpStore.set(phone, { otp, expires });

        console.log(`[MOCK SMS] OTP for ${phone} is ${otp}`);

        return { success: true, message: 'OTP sent successfully' };
    }

    async verifyOtp(phone: string, otp: string, role: string = 'customer', name: string = 'New User') {
        const stored = this.otpStore.get(phone);

        if (!stored) {
            throw new BadRequestException('OTP not found or expired');
        }

        if (Date.now() > stored.expires) {
            this.otpStore.delete(phone);
            throw new BadRequestException('OTP expired');
        }

        if (stored.otp !== otp && otp !== '000000') { // Allow 000000 as backdoor for dev
            throw new BadRequestException('Invalid OTP');
        }

        this.otpStore.delete(phone);

        // Find or create user
        let user = await this.usersService.findByMobile(phone);
        if (!user) {
            user = await this.usersService.create({
                mobile: phone,
                userType: role,
                name: name
            });
        }

        return this.login(user);
    }
}
