import { IsString, IsDateString, IsNumber, Min, Max, MinLength, MaxLength, IsOptional, IsArray } from 'class-validator';

export class CreateBookingDto {
    @IsString()
    @MinLength(1)
    serviceId: string;

    @IsString()
    @MinLength(3)
    serviceName: string;

    @IsString()
    @MinLength(10)
    @MaxLength(200)
    address: string;

    @IsDateString()
    scheduledTime: string;

    @IsNumber()
    @Min(1)
    @Max(100000)
    totalAmount: number;

    @IsOptional()
    @IsArray()
    addOns?: Array<{
        id: number;
        name: string;
        price: number;
    }>;
}
