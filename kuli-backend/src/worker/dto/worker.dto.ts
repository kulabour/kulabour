import { IsString, IsNumber, IsBoolean, IsArray, IsOptional } from 'class-validator';

export class UpdateWorkerProfileDto {
  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsNumber()
  ratePerHour?: number;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsOptional()
  @IsBoolean()
  isOnline?: boolean;
}

export class UpdateLocationDto {
  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
