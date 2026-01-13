import mongoose from 'mongoose';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instant-labor';

        await mongoose.connect(MONGODB_URI);

        logger.info({
            database: mongoose.connection.name,
            host: mongoose.connection.host
        }, 'MongoDB Connected Successfully');
    } catch (error: any) {
        logger.error({ error: error.message }, 'MongoDB Connection Error');
        // Don't exit process in development - continue with in-memory if DB unavailable
        logger.warn('Continuing without database connection');
    }
};

export default connectDB;
