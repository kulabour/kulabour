import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface SearchFilters {
    skills?: string[];
    minRating?: number;
    maxPrice?: number;
    location?: {
        latitude: number;
        longitude: number;
        radius: number; // in km
    };
    available?: boolean;
    sortBy?: 'rating' | 'price' | 'distance';
    sortOrder?: 'asc' | 'desc';
}

@Injectable()
export class SearchService {
    constructor(
        @InjectModel('Worker') private workerModel: Model<any>
    ) { }

    /**
     * Search workers with advanced filters
     */
    async searchWorkers(filters: SearchFilters, limit: number = 20) {
        const query: any = {};

        // Skills filter
        if (filters.skills && filters.skills.length > 0) {
            query.skills = { $in: filters.skills };
        }

        // Rating filter
        if (filters.minRating) {
            query.rating = { $gte: filters.minRating };
        }

        // Price filter
        if (filters.maxPrice) {
            query.hourlyRate = { $lte: filters.maxPrice };
        }

        // Availability filter
        if (filters.available !== undefined) {
            query.available = filters.available;
        }

        // Location filter (geospatial query)
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
                    $maxDistance: filters.location.radius * 1000, // Convert km to meters
                },
            };
        }

        // Build aggregation pipeline
        const pipeline: any[] = [
            { $match: query },
        ];

        // Add sorting
        if (filters.sortBy) {
            const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
            pipeline.push({
                $sort: { [filters.sortBy]: sortOrder },
            });
        }

        // Limit results
        pipeline.push({ $limit: limit });

        // Execute search
        const workers = await this.workerModel.aggregate(pipeline) as any;

        return {
            total: workers.length,
            workers: workers.map((w: any) => ({
                id: w._id,
                name: w.name,
                skills: w.skills,
                rating: w.rating,
                totalRatings: w.totalRatings,
                hourlyRate: w.hourlyRate,
                available: w.available,
                distance: w.distance, // Added by geospatial query
                profilePhoto: w.profilePhoto,
            })),
        };
    }

    /**
     * Get search suggestions (autocomplete)
     */
    async getSuggestions(query: string, type: 'skills' | 'locations') {
        if (type === 'skills') {
            // Get unique skills matching query
            const skills = await this.workerModel.distinct('skills', {
                skills: { $regex: query, $options: 'i' },
            });
            return skills.slice(0, 10);
        }

        // Location suggestions would require a locations collection
        return [];
    }

    /**
     * Get popular searches
     */
    async getPopularSearches(limit: number = 10) {
        // This would require storing search history
        // For now, return most common skills
        const pipeline = [
            { $unwind: '$skills' },
            { $group: { _id: '$skills', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
        ];

        const results = await this.workerModel.aggregate(pipeline as any) as any;
        return results.map((r: any) => r._id);
    }

    /**
     * Save user search for recommendations
     */
    async saveSearch(userId: string, filters: SearchFilters) {
        // Store search history for personalized recommendations
        // Implementation depends on search history model
        console.log(`Saving search for user ${userId}`, filters);
    }
}
