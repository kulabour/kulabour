import { IsString, IsBoolean, IsOptional, IsInt, Min, Max } from 'class-validator';

export class UpdateNotificationPrefsDto {
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  smsEnabled?: boolean;

  @IsBoolean()
  @IsOptional()
  bookingAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  paymentAlerts?: boolean;

  @IsBoolean()
  @IsOptional()
  promotionAlerts?: boolean;

  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  quietHoursStart?: number;

  @IsInt()
  @Min(0)
  @Max(23)
  @IsOptional()
  quietHoursEnd?: number;

  @IsString()
  @IsOptional()
  fcmToken?: string;
}

export class RegisterFcmTokenDto {
  @IsString()
  fcmToken: string;
}

export class MarkNotificationReadDto {
  @IsString()
  notificationId: string;
}
