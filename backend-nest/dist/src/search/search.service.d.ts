import { Model } from 'mongoose';
interface SearchFilters {
    skills?: string[];
    minRating?: number;
    maxPrice?: number;
    location?: {
        latitude: number;
        longitude: number;
        radius: number;
    };
    available?: boolean;
    sortBy?: 'rating' | 'price' | 'distance';
    sortOrder?: 'asc' | 'desc';
}
export declare class SearchService {
    private workerModel;
    constructor(workerModel: Model<any>);
    searchWorkers(filters: SearchFilters, limit?: number): Promise<{
        total: any;
        workers: any;
    }>;
    getSuggestions(query: string, type: 'skills' | 'locations'): Promise<any[]>;
    getPopularSearches(limit?: number): Promise<any>;
    saveSearch(userId: string, filters: SearchFilters): Promise<void>;
}
export {};
