import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getDatabaseConfig = (): MongooseModuleOptions => {
    return {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kulabour',

        // Connection pooling
        maxPoolSize: 10,
        minPoolSize: 2,

        // Socket settings
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,

        // Performance optimizations
        retryWrites: true,
        retryReads: true,

        // Compression
        compressors: ['zlib'],

        // Auto-index management
        autoIndex: process.env.NODE_ENV !== 'production',

        // Connection pool monitoring
        monitorCommands: process.env.NODE_ENV === 'development',
    };
};

// Index definitions for common queries
export const databaseIndexes = {
    users: [
        { phone: 1 },
        { email: 1 },
        { createdAt: -1 },
        { 'location.coordinates': '2dsphere' }, // Geospatial index
    ],

    bookings: [
        { userId: 1, createdAt: -1 },
        { workerId: 1, status: 1 },
        { status: 1, createdAt: -1 },
        { 'location.coordinates': '2dsphere' },
    ],

    services: [
        { category: 1, active: 1 },
        { popular: -1 },
    ],

    workers: [
        { 'location.coordinates': '2dsphere' },
        { rating: -1, available: 1 },
        { skills: 1, available: 1 },
    ],
};
