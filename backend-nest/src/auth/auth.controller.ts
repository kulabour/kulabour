import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SendOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.mobile, loginDto.password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.authService.login(user);
    }

    @Public()
    @Post('admin/login')
    async adminLogin(@Body() body: any) { // Using simple body for now, or create AdminLoginDto
        const user = await this.authService.validateAdmin(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Invalid Admin Credentials');
        }
        return this.authService.login(user);
    }

    @Public()
    @Post('send-otp')
    async sendOtp(@Body() dto: SendOtpDto) {
        return this.authService.sendOtp(dto.mobile);
    }

    @Public()
    @Post('verify-otp')
    async verifyOtp(@Body() dto: VerifyOtpDto) {
        return this.authService.verifyOtp(dto.mobile, dto.otp, dto.role, dto.name);
    }
}
