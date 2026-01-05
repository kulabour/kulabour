import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface Rating {
    bookingId: string;
    workerId: string;
    customerId: string;
    rating: number; // 1-5
    review?: string;
    photos?: string[];
    response?: string; // Worker's response
    createdAt: Date;
}

@Injectable()
export class RatingService {
    constructor(
        @InjectModel('Rating') private ratingModel: Model<Rating>
    ) { }

    /**
     * Create a new rating
     */
    async createRating(data: {
        bookingId: string;
        workerId: string;
        customerId: string;
        rating: number;
        review?: string;
        photos?: string[];
    }) {
        // Validate rating
        if (data.rating < 1 || data.rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        // Check if rating already exists
        const existing = await this.ratingModel.findOne({
            bookingId: data.bookingId,
        });

        if (existing) {
            throw new Error('Rating already exists for this booking');
        }

        // Create rating
        const rating = await this.ratingModel.create({
            ...data,
            createdAt: new Date(),
        });

        // Update worker's aggregate rating
        await this.updateWorkerRating(data.workerId);

        return rating;
    }

    /**
     * Get ratings for a worker
     */
    async getWorkerRatings(workerId: string, limit: number = 10) {
        return this.ratingModel
            .find({ workerId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('-__v');
    }

    /**
     * Get worker's aggregate rating
     */
    async getWorkerStats(workerId: string) {
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

        // Rating distribution
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((r) => {
            (distribution as any)[r.rating]++;
        });

        return {
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings: ratings.length,
            distribution,
        };
    }

    /**
     * Update worker's aggregate rating in workers collection
     */
    private async updateWorkerRating(workerId: string) {
        const stats = await this.getWorkerStats(workerId);

        // Update worker document (assuming Worker model exists)
        // await this.workerModel.updateOne(
        //   { _id: workerId },
        //   { rating: stats.averageRating, totalRatings: stats.totalRatings }
        // );
    }

    /**
     * Add worker response to a rating
     */
    async addWorkerResponse(ratingId: string, response: string) {
        return this.ratingModel.findByIdAndUpdate(
            ratingId,
            { response },
            { new: true }
        );
    }

    /**
     * Get top-rated workers
     */
    async getTopWorkers(limit: number = 10) {
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
                    count: { $gte: 5 }, // At least 5 ratings
                },
            },
            {
                $sort: { averageRating: -1 },
            },
            {
                $limit: limit,
            },
        ] as any);

        return allRatings;
    }
}
