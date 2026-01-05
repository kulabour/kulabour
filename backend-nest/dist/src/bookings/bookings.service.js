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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("./schemas/booking.schema");
const workers_service_1 = require("../workers/workers.service");
let BookingsService = class BookingsService {
    constructor(bookingModel, workersService) {
        this.bookingModel = bookingModel;
        this.workersService = workersService;
    }
    async create(createBookingDto, user) {
        const booking = new this.bookingModel({
            ...createBookingDto,
            customerId: user.userId,
            customerName: user.name,
        });
        const savedBooking = await booking.save();
        const defaultLat = 28.6139;
        const defaultLng = 77.2090;
        try {
            const nearbyWorkers = await this.workersService.findNearbyWorkers(defaultLat, defaultLng, 5000);
            console.log(`✅ Found ${nearbyWorkers.length} nearby workers within 5km`);
        }
        catch (error) {
            console.error('❌ Error finding nearby workers:', error);
        }
        return savedBooking;
    }
    async findAll() {
        return this.bookingModel.find().exec();
    }
    async findOne(id) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async countTotal() {
        return this.bookingModel.countDocuments().exec();
    }
    async getTotalRevenue() {
        const result = await this.bookingModel.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]).exec();
        return result[0]?.total || 0;
    }
    async findRecent(limit = 5) {
        return this.bookingModel.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        workers_service_1.WorkersService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map