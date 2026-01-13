import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { captureException, addBreadcrumb } from '../config/sentry';

/**
 * Global error handling middleware
 * Must be registered LAST in server.js (after all routes)
 */

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    // Add breadcrumb for Sentry
    addBreadcrumb('Error occurred', {
        url: req.url,
        method: req.method,
        errorName: err.name,
    }, 'error');

    // Capture in Sentry with context
    captureException(err, {
        user: req.user ? {
            id: req.user._id?.toString(),
            username: req.user.name,
        } : undefined,
        extra: {
            correlationId: req.correlationId,
            path: req.path,
            query: req.query,
            body: req.body,
        },
        tags: {
            errorType: err.name,
            statusCode: err.statusCode?.toString() || '500',
        },
    });

    // Log error with full context
    logger.error({
        error: {
            message: err.message,
            name: err.name,
            code: err.code,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        },
        request: {
            method: req.method,
            url: req.url,
            path: req.path,
            ip: req.ip,
            correlationId: req.correlationId,
            userId: req.user?._id?.toString()
        },
        timestamp: new Date().toISOString()
    }, `Error: ${err.message}`);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e: any) => ({
            field: e.path,
            message: e.message
        }));

        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }

    // MongoDB duplicate key error (E11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const value = err.keyValue[field];

        return res.status(409).json({
            error: 'Duplicate entry',
            message: `${field}: '${value}' already exists`,
            field
        });
    }

    // Mongoose cast error (invalid ObjectId format)
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID format',
            message: `Invalid ${err.path}: '${err.value}'`,
            field: err.path
        });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid authentication token',
            message: 'The provided token is malformed or invalid'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Authentication token expired',
            message: 'Your session has expired. Please login again.'
        });
    }

    // MongoDB connection errors
    if (err.name === 'MongoNetworkError' || err.name === 'MongoTimeoutError') {
        return res.status(503).json({
            error: 'Database unavailable',
            message: 'Unable to connect to database. Please try again later.'
        });
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'Maximum file size is 5MB'
            });
        }

        return res.status(400).json({
            error: 'File upload failed',
            message: err.message
        });
    }

    // Custom application errors (if you throw with statusCode property)
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            error: err.name || 'Application error',
            message: err.message
        });
    }

    // Default error (500 Internal Server Error)
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal server error. Please try again later.'
        : err.message;

    res.status(statusCode).json({
        error: 'Server error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

/**
 * 404 Not Found handler
 * Use this before error handler for undefined routes
 */
export const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.url}`,
        path: req.url
    });
};

/**
 * Async error wrapper to catch errors in async route handlers
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
