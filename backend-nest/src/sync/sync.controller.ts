import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncPullQueryDto, SyncPushDto } from './dto/sync.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Enable when ready

@Controller('sync')
export class SyncController {
    constructor(private readonly syncService: SyncService) { }

    @Get()
    // @UseGuards(JwtAuthGuard)
    async pullChanges(@Query('last_pulled_at') lastPulledAt: string) {
        const timestamp = lastPulledAt ? parseInt(lastPulledAt) : 0;
        return this.syncService.pullChanges(timestamp);
    }

    @Post()
    // @UseGuards(JwtAuthGuard)
    async pushChanges(@Body() body: SyncPushDto) {
        await this.syncService.pushChanges(body.changes);
        return { success: true };
    }
}
