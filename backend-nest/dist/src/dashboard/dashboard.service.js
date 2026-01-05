"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bookings_service_1 = require("../bookings/bookings.service");
let DashboardService = class DashboardService {
    constructor(usersService, bookingsService) {
        this.usersService = usersService;
        this.bookingsService = bookingsService;
    }
    async getStats() {
        const totalRevenue = await this.bookingsService.getTotalRevenue();
        const activeWorkers = await this.usersService.countActiveWorkers();
        const totalBookings = await this.bookingsService.countTotal();
        const recentBookings = await this.bookingsService.findRecent(5);
        const recentActivity = recentBookings.map((b) => ({
            id: b._id.toString(),
            user: b.customerName || 'Unknown User',
            service: b.serviceName || 'Service',
            amount: b.totalAmount,
            status: b.status.charAt(0).toUpperCase() + b.status.slice(1)
        }));
        return {
            revenue: {
                total: totalRevenue,
                growth: 12.5,
                history: [
                    { name: 'Mon', revenue: totalRevenue * 0.1 },
                    { name: 'Tue', revenue: totalRevenue * 0.2 },
                    { name: 'Wed', revenue: totalRevenue * 0.15 },
                    { name: 'Thu', revenue: totalRevenue * 0.25 },
                    { name: 'Fri', revenue: totalRevenue * 0.3 },
                    { name: 'Sat', revenue: totalRevenue * 0.4 },
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        bookings_service_1.BookingsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map