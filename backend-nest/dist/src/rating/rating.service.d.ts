import { Model } from 'mongoose';
interface Rating {
    bookingId: string;
    workerId: string;
    customerId: string;
    rating: number;
    review?: string;
    photos?: string[];
    response?: string;
    createdAt: Date;
}
export declare class RatingService {
    private ratingModel;
    constructor(ratingModel: Model<Rating>);
    createRating(data: {
        bookingId: string;
        workerId: string;
        customerId: string;
        rating: number;
        review?: string;
        photos?: string[];
    }): Promise<import("mongoose").Document<unknown, {}, Rating, {}, {}> & Rating & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getWorkerRatings(workerId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, Rating, {}, {}> & Rating & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getWorkerStats(workerId: string): Promise<{
        averageRating: number;
        totalRatings: number;
        distribution: {
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
        };
    }>;
    private updateWorkerRating;
    addWorkerResponse(ratingId: string, response: string): Promise<(import("mongoose").Document<unknown, {}, Rating, {}, {}> & Rating & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getTopWorkers(limit?: number): Promise<any[]>;
}
export {};
