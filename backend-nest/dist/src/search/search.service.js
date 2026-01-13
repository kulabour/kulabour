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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let SearchService = class SearchService {
    constructor(workerModel) {
        this.workerModel = workerModel;
    }
    async searchWorkers(filters, limit = 20) {
        const query = {};
        if (filters.skills && filters.skills.length > 0) {
            query.skills = { $in: filters.skills };
        }
        if (filters.minRating) {
            query.rating = { $gte: filters.minRating };
        }
        if (filters.maxPrice) {
            query.hourlyRate = { $lte: filters.maxPrice };
        }
        if (filters.available !== undefined) {
            query.available = filters.available;
        }
        if (filters.location) {
            query['location.coordinates'] = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [
                            filters.location.longitude,
                            filters.location.latitude,
                        ],
                    },
                    $maxDistance: filters.location.radius * 1000,
                },
            };
        }
        const pipeline = [
            { $match: query },
        ];
        if (filters.sortBy) {
            const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
            pipeline.push({
                $sort: { [filters.sortBy]: sortOrder },
            });
        }
        pipeline.push({ $limit: limit });
        const workers = await this.workerModel.aggregate(pipeline);
        return {
            total: workers.length,
            workers: workers.map((w) => ({
                id: w._id,
                name: w.name,
                skills: w.skills,
                rating: w.rating,
                totalRatings: w.totalRatings,
                hourlyRate: w.hourlyRate,
                available: w.available,
                distance: w.distance,
                profilePhoto: w.profilePhoto,
            })),
        };
    }
    async getSuggestions(query, type) {
        if (type === 'skills') {
            const skills = await this.workerModel.distinct('skills', {
                skills: { $regex: query, $options: 'i' },
            });
            return skills.slice(0, 10);
        }
        return [];
    }
    async getPopularSearches(limit = 10) {
        const pipeline = [
            { $unwind: '$skills' },
            { $group: { _id: '$skills', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
        ];
        const results = await this.workerModel.aggregate(pipeline);
        return results.map((r) => r._id);
    }
    async saveSearch(userId, filters) {
        console.log(`Saving search for user ${userId}`, filters);
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Worker')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SearchService);
//# sourceMappingURL=search.service.js.map