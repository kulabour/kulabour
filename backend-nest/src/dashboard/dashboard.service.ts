import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly usersService: UsersService,
        private readonly bookingsService: BookingsService,
    ) { }

    async getStats() {
        // Real Data Aggregation
        const totalRevenue = await this.bookingsService.getTotalRevenue();
        const activeWorkers = await this.usersService.countActiveWorkers();
        const totalBookings = await this.bookingsService.countTotal();
        const recentBookings = await this.bookingsService.findRecent(5);

        // Transform recent bookings for UI
        const recentActivity = recentBookings.map((b: any) => ({
            id: b._id.toString(),
            user: b.customerName || 'Unknown User',
            service: b.serviceName || 'Service',
            amount: b.totalAmount,
            status: b.status.charAt(0).toUpperCase() + b.status.slice(1) // Capitalize
        }));

        return {
            revenue: {
                total: totalRevenue,
                growth: 12.5, // Mocked growth for now
                history: [ // Mocked history for chart visuals
                    { name: 'Mon', revenue: totalRevenue * 0.1 },
                    { name: 'Tue', revenue: totalRevenue * 0.2 },
                    { name: 'Wed', revenue: totalRevenue * 0.15 },
                    { name: 'Thu', revenue: totalRevenue * 0.25 },
                    { name: 'Fri', revenue: totalRevenue * 0.3 },
                    { name: 'Sat', revenue: totalRevenue * 0.4 }, // Skewed to today
                    { name: 'Sun', revenue: totalRevenue * 0.1 },
                ]
            },
            activeWorkers: {
                count: activeWorkers,
                growth: 5.2
            },
            bookings: {
                count: totalBookings,
                growth: 4.8
            },
            recentActivity: recentActivity
        };
    }
}
