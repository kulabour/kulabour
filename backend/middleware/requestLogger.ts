import { Request, Response, NextFunction } from 'express';
import pinoHttp from 'pino-http';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

// Extend Express Request to include correlationId
declare global {
    namespace Express {
        interface Request {
            correlationId?: string;
        }
    }
}

/**
 * HTTP request logger middleware using pino-http
 */
export const httpLogger = pinoHttp({
    logger: logger,
    // Generate correlation ID for each request
    genReqId: (req: Request) => {
        const correlationId = uuidv4();
        req.correlationId = correlationId;
        return correlationId;
    },
    // Custom request message
    customLogLevel: (req: Request, res: Response, err?: Error) => {
        if (res.statusCode >= 500 || err) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
    },
    // Custom success message
    customSuccessMessage: (req: Request, res: Response) => {
        return `${req.method} ${req.url} ${res.statusCode}`;
    },
    // Custom error message
    customErrorMessage: (req: Request, res: Response, err: Error) => {
        return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
    },
    // Customize logged request data
    customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
        responseTime: 'duration'
    },
    // Serialize request
    serializers: {
        req: (req: Request) => ({
            id: req.correlationId,
            method: req.method,
            url: req.url,
            path: req.path,
            query: req.query,
            // User info if authenticated
            user: req.user ? {
                id: req.user._id?.toString(),
                type: req.user.userType,
                mobile: req.user.mobile
            } : undefined,
            // Client info
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent')
        }),
        res: (res: Response) => ({
            statusCode: res.statusCode
        })
    },
    // Don't auto-log - we'll manually log to have more control
    autoLogging: {
        ignore: (req: Request) => {
            // Don't log health checks in production
            if (process.env.NODE_ENV === 'production' && req.path === '/health') {
                return true;
            }
            return false;
        }
    }
});

/**
 * Manual request logger for more control
 * Use this instead of httpLogger if you need custom logic
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    // Generate correlation ID
    req.correlationId = uuidv4();

    // Capture start time
    const startTime = Date.now();

    // Log incoming request
    logger.info({
        correlationId: req.correlationId,
        method: req.method,
        url: req.url,
        path: req.path,
        query: req.query,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        userId: req.user?._id?.toString()
    }, `→ ${req.method} ${req.url}`);

    // Intercept response
    const originalSend = res.send;
    res.send = function (data: any): Response {
        const duration = Date.now() - startTime;

        // Log response
        const logData: any = {
            correlationId: req.correlationId,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?._id?.toString()
        };

        // Log based on status code
        if (res.statusCode >= 500) {
            logger.error(logData, `← ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
        } else if (res.statusCode >= 400) {
            logger.warn(logData, `← ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
        } else {
            logger.info(logData, `← ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
        }

        return originalSend.call(this, data);
    };

    next();
};

/**
 * Add correlation ID to response headers
 */
export const correlationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.correlationId) {
        res.setHeader('X-Correlation-ID', req.correlationId);
    }
    next();
};
