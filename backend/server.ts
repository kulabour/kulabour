import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/database';
import { initializeWebSocket } from './websocket';
import logger from './utils/logger';

dotenv.config();

// ===== ENVIRONMENT VALIDATION =====
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
requiredEnvVars.forEach(key => {
    if (!process.env[key]) {
        logger.fatal({ missingVar: key }, `Missing required environment variable: ${key}`);
        process.exit(1);
    }
});

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger.warn('JWT_SECRET should be at least 32 characters for security');
}

const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

// ===== START SERVER =====
connectDB().then(() => {
    server.listen(PORT, () => {
        logger.info({
            port: PORT,
            environment: process.env.NODE_ENV || 'development',
        }, `KULABOUR Backend Server started on port ${PORT}`);
    });
}).catch((err: Error) => {
    logger.fatal({ error: err.message }, 'Failed to start server');
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Closing server gracefully...');
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (err: Error) => {
    logger.fatal({ error: err }, 'Uncaught Exception');
    process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.fatal({ reason, promise: promise.toString() }, 'Unhandled Rejection');
    process.exit(1);
});
