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
exports.RatingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RatingService = class RatingService {
    constructor(ratingModel) {
        this.ratingModel = ratingModel;
    }
    async createRating(data) {
        if (data.rating < 1 || data.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }
        const existing = await this.ratingModel.findOne({
            bookingId: data.bookingId,
        });
        if (existing) {
            throw new Error('Rating already exists for this booking');
        }
        const rating = await this.ratingModel.create({
            ...data,
            createdAt: new Date(),
        });
        await this.updateWorkerRating(data.workerId);
        return rating;
    }
    async getWorkerRatings(workerId, limit = 10) {
        return this.ratingModel
            .find({ workerId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('-__v');
    }
    async getWorkerStats(workerId) {
        const ratings = await this.ratingModel.find({ workerId });
        if (ratings.length === 0) {
            return {
                averageRating: 0,
                totalRatings: 0,
                distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            };
        }
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / ratings.length;
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
            distribution[r.rating]++;
        });
        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings: ratings.length,
            distribution,
        };
    }
    async updateWorkerRating(workerId) {
        const stats = await this.getWorkerStats(workerId);
    }
    async addWorkerResponse(ratingId, response) {
        return this.ratingModel.findByIdAndUpdate(ratingId, { response }, { new: true });
    }
    async getTopWorkers(limit = 10) {
        const allRatings = await this.ratingModel.aggregate([
            {
                $group: {
                    _id: '$workerId',
                    averageRating: { $avg: '$rating' },
                    count: { $sum: 1 },
                },
            },
            {
                $match: {
                    count: { $gte: 5 },
                },
            },
            {
                $sort: { averageRating: -1 },
            },
            {
                $limit: limit,
            },
        ]);
        return allRatings;
    }
};
exports.RatingService = RatingService;
exports.RatingService = RatingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Rating')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RatingService);
//# sourceMappingURL=rating.service.js.map