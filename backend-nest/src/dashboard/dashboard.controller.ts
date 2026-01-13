import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AdminAuthGuard } from '../auth/admin.guard';

@Controller('admin')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('stats')
    @UseGuards(AdminAuthGuard)
    async getStats() {
        return this.dashboardService.getStats();
    }
}
