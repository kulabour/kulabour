"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instant-labor';
        await mongoose_1.default.connect(MONGODB_URI);
        logger_1.default.info({
            database: mongoose_1.default.connection.name,
            host: mongoose_1.default.connection.host
        }, 'MongoDB Connected Successfully');
    }
    catch (error) {
        logger_1.default.error({ error: error.message }, 'MongoDB Connection Error');
        // Don't exit process in development - continue with in-memory if DB unavailable
        logger_1.default.warn('Continuing without database connection');
    }
};
exports.default = connectDB;
