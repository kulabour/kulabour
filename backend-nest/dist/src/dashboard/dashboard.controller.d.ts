import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
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
