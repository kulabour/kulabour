import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdaptiveTrackingService, WorkerState, LocationUpdate } from './adaptive-tracking.service';

interface LocationDto extends LocationUpdate {
  city: string;
  state: WorkerState;
}

interface BatchLocationDto {
  city: string;
  state: WorkerState;
  updates: LocationUpdate[];
}

@Controller('tracking')
@UseGuards(AuthGuard('jwt'))
export class TrackingController {
  constructor(private readonly trackingService: AdaptiveTrackingService) {}

  @Post('location')
  async updateLocation(@Request() req: any, @Body() dto: LocationDto) {
    // Basic validation
    if (!dto.city || !dto.state || !dto.lat || !dto.lng) {
      throw new Error('Missing required fields');
    }

    return this.trackingService.updateLocation(
      req.user.sub,
      dto.city,
      dto.state,
      {
        lat: dto.lat,
        lng: dto.lng,
        accuracy: dto.accuracy || 10,
        heading: dto.heading || 0,
        speed: dto.speed || 0,
        timestamp: dto.timestamp || new Date().toISOString(),
        batteryLevel: dto.batteryLevel
      }
    );
  }

  @Post('location/batch')
  async updateLocationBatch(@Request() req: any, @Body() dto: BatchLocationDto) {
    if (!dto.city || !dto.state || !dto.updates || !Array.isArray(dto.updates)) {
      throw new Error('Invalid batch format');
    }

    return this.trackingService.updateLocationBatch({
      workerId: req.user.sub,
      city: dto.city,
      state: dto.state,
      updates: dto.updates
    });
  }
}
