import { Controller, Get, Patch, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkerService } from './worker.service';
import { UpdateWorkerProfileDto, UpdateLocationDto } from './dto/worker.dto';

@Controller('workers')
@UseGuards(AuthGuard('jwt'))
export class WorkerController {
  constructor(private readonly workerService: WorkerService) {}

  @Get('profile')
  async getMyProfile(@Request() req: any) {
    return this.workerService.getProfile(req.user.sub);
  }

  @Patch('profile')
  async updateProfile(@Request() req: any, @Body() dto: UpdateWorkerProfileDto) {
    return this.workerService.updateProfile(req.user.sub, dto);
  }

  @Patch('location')
  async updateLocation(@Request() req: any, @Body() dto: UpdateLocationDto) {
    return this.workerService.updateLocation(req.user.sub, dto);
  }

  @Patch('online-status')
  async updateOnlineStatus(@Request() req: any, @Body() dto: { isOnline: boolean; city?: string }) {
    if (typeof dto.isOnline !== 'boolean') {
      throw new Error('isOnline must be a boolean');
    }
    return this.workerService.updateOnlineStatus(req.user.sub, dto.isOnline, dto.city);
  }

  @Get(':id')
  async getWorker(@Param('id') id: string) {
    return this.workerService.getWorkerById(id);
  }

  @Get(':id/reviews')
  async getWorkerReviews(
    @Param('id') id: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.workerService.getWorkerReviews(id, parseInt(page, 10), parseInt(limit, 10));
  }
}
