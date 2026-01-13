import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
export declare class DashboardService {
    private readonly usersService;
    private readonly bookingsService;
    constructor(usersService: UsersService, bookingsService: BookingsService);
    getStats(): Promise<{
        revenue: {
            total: number;
            growth: number;
            history: {
                name: string;
                revenue: number;
            }[];
        };
        activeWorkers: {
            count: number;
            growth: number;
        };
        bookings: {
            count: number;
            growth: number;
        };
        recentActivity: {
            id: any;
            user: any;
            service: any;
            amount: any;
            status: any;
        }[];
    }>;
}
