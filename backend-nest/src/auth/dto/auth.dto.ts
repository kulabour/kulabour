import { IsString, MinLength, MaxLength, Matches, IsOptional } from 'class-validator';

export class LoginDto {
    @IsString()
    @MinLength(10)
    @MaxLength(10)
    @Matches(/^[0-9]{10}$/, { message: 'Mobile must be 10 digits' })
    mobile: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class SendOtpDto {
    @IsString()
    @MinLength(10)
    @MaxLength(10)
    @Matches(/^[0-9]{10}$/, { message: 'Mobile must be 10 digits' })
    mobile: string;
}

export class VerifyOtpDto {
    @IsString()
    @MinLength(10)
    @MaxLength(10)
    mobile: string;

    @IsString()
    @MinLength(4)
    @MaxLength(6)
    otp: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsString()
    name?: string;
}
