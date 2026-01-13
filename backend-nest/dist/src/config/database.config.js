"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseIndexes = exports.getDatabaseConfig = void 0;
const getDatabaseConfig = () => {
    return {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kulabour',
        maxPoolSize: 10,
        minPoolSize: 2,
        socketTimeoutMS: 45000,
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        retryReads: true,
        compressors: ['zlib'],
        autoIndex: process.env.NODE_ENV !== 'production',
        monitorCommands: process.env.NODE_ENV === 'development',
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
exports.databaseIndexes = {
    users: [
        { phone: 1 },
        { email: 1 },
        { createdAt: -1 },
        { 'location.coordinates': '2dsphere' },
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
//# sourceMappingURL=database.config.js.map