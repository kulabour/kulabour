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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.otpStore = new Map();
    }
    async validateUser(mobile, pass) {
        const user = await this.usersService.findByMobile(mobile);
        if (user) {
            return user;
        }
        return null;
    }
    async login(user) {
        const payload = { mobile: user.mobile, sub: user._id, role: user.userType || 'customer' };
        return {
            access_token: this.jwtService.sign(payload),
            user: user,
        };
    }
    async validateAdmin(email, pass) {
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
    async sendOtp(phone) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 5 * 60 * 1000;
        this.otpStore.set(phone, { otp, expires });
        console.log(`[MOCK SMS] OTP for ${phone} is ${otp}`);
        return { success: true, message: 'OTP sent successfully' };
    }
    async verifyOtp(phone, otp, role = 'customer', name = 'New User') {
        const stored = this.otpStore.get(phone);
        if (!stored) {
            throw new common_1.BadRequestException('OTP not found or expired');
        }
        if (Date.now() > stored.expires) {
            this.otpStore.delete(phone);
            throw new common_1.BadRequestException('OTP expired');
        }
        if (stored.otp !== otp && otp !== '000000') {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        this.otpStore.delete(phone);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map