import { MongooseModuleOptions } from '@nestjs/mongoose';
export declare const getDatabaseConfig: () => MongooseModuleOptions;
export declare const databaseIndexes: {
    users: ({
        phone: number;
        email?: undefined;
        createdAt?: undefined;
        'location.coordinates'?: undefined;
    } | {
        email: number;
        phone?: undefined;
        createdAt?: undefined;
        'location.coordinates'?: undefined;
    } | {
        createdAt: number;
        phone?: undefined;
        email?: undefined;
        'location.coordinates'?: undefined;
    } | {
        'location.coordinates': string;
        phone?: undefined;
        email?: undefined;
        createdAt?: undefined;
    })[];
    bookings: ({
        userId: number;
        createdAt: number;
        workerId?: undefined;
        status?: undefined;
        'location.coordinates'?: undefined;
    } | {
        workerId: number;
        status: number;
        userId?: undefined;
        createdAt?: undefined;
        'location.coordinates'?: undefined;
    } | {
        status: number;
        createdAt: number;
        userId?: undefined;
        workerId?: undefined;
        'location.coordinates'?: undefined;
    } | {
        'location.coordinates': string;
        userId?: undefined;
        createdAt?: undefined;
        workerId?: undefined;
        status?: undefined;
    })[];
    services: ({
        category: number;
        active: number;
        popular?: undefined;
    } | {
        popular: number;
        category?: undefined;
        active?: undefined;
    })[];
    workers: ({
        'location.coordinates': string;
        rating?: undefined;
        available?: undefined;
        skills?: undefined;
    } | {
        rating: number;
        available: number;
        'location.coordinates'?: undefined;
        skills?: undefined;
    } | {
        skills: number;
        available: number;
        'location.coordinates'?: undefined;
        rating?: undefined;
    })[];
};
