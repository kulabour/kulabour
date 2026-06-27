import { IsString, IsMobilePhone, Length, Matches } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Phone must be a valid Indian mobile number in format +91XXXXXXXXXX',
  })
  phone: string;
}

export class VerifyOtpDto {
  @IsString()
  @Matches(/^\+91[6-9]\d{9}$/, {
    message: 'Phone must be a valid Indian mobile number in format +91XXXXXXXXXX',
  })
  phone: string;

  @IsString()
  @Length(4, 6, { message: 'OTP must be 4-6 digits' })
  @Matches(/^\d+$/, { message: 'OTP must contain only digits' })
  otp: string;

  /** Device fingerprint for session management */
  @IsString()
  deviceId: string;
}

export class RefreshTokenDto {
  @IsString()
  refreshToken: string;

  @IsString()
  deviceId: string;
}

export class LogoutDto {
  @IsString()
  deviceId: string;
}
