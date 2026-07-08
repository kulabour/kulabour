import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @IsString()
  categoryId: string;

  @IsString()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  @IsOptional()
  estimatedHours?: number;
}

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
