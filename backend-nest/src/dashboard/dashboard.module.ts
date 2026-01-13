import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { UsersModule } from '../users/users.module';
import { BookingsModule } from '../bookings/bookings.module';

import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [UsersModule, BookingsModule, AuthModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
