import pino from 'pino';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Determine environment
const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');

// Base logger configuration
const loggerConfig: pino.LoggerOptions = {
    level: logLevel,
    // Redact sensitive fields
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'password',
            'token',
            'accessToken',
            'refreshToken',
            'otp',
            'secret',
            'apiKey',
            'req.body.password',
            'req.body.otp',
            'res.body.password',
            'res.body.token'
        ],
        remove: true
    },
    // Serialize errors properly
    serializers: {
        err: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res
    }
};

// Development: Pretty print to console
if (isDevelopment) {
    loggerConfig.transport = {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
            singleLine: false,
            messageFormat: '{levelLabel} - {msg}'
        }
    };
}

// Production: Write to files with rotation
if (!isDevelopment) {
    loggerConfig.transport = {
        targets: [
            // All logs
            {
                target: 'pino/file',
                level: 'info',
                options: {
                    destination: path.join(logsDir, 'combined.log'),
                    mkdir: true
                }
            },
            // Error logs only
            {
                target: 'pino/file',
                level: 'error',
                options: {
                    destination: path.join(logsDir, 'error.log'),
                    mkdir: true
                }
            },
            // Console for critical errors
            {
                target: 'pino-pretty',
                level: 'error',
                options: {
                    colorize: true,
                    translateTime: 'HH:MM:ss Z',
                    ignore: 'pid,hostname'
                }
            }
        ]
    };
}

// Create logger instance
const logger = pino(loggerConfig);

/**
 * Create child logger with additional context
 * @param context - Additional context to include in all logs
 */
export const createLogger = (context: Record<string, any>) => {
    return logger.child(context);
};

/**
 * Log with timing information
 * @param label - Label for the operation
 * @param fn - Function to time
 */
export const logTiming = async <T>(
    label: string,
    fn: () => Promise<T>
): Promise<T> => {
    const start = Date.now();
    try {
        const result = await fn();
        const duration = Date.now() - start;
        logger.info({ operation: label, duration }, `${label} completed in ${duration}ms`);
        return result;
    } catch (error) {
        const duration = Date.now() - start;
        logger.error({ operation: label, duration, error }, `${label} failed after ${duration}ms`);
        throw error;
    }
};

/**
 * Log database query
 */
export const logQuery = (query: string, params?: any, duration?: number) => {
    logger.debug({ query, params, duration }, 'Database query executed');
};

/**
 * Log external API call
 */
export const logExternalCall = (service: string, method: string, url: string, duration: number, status?: number) => {
    logger.info({ service, method, url, duration, status }, `External API call: ${service}`);
};

/**
 * Log user action
 */
export const logUserAction = (userId: string, action: string, details?: any) => {
    logger.info({ userId, action, ...details }, `User action: ${action}`);
};

/**
 * Log security event
 */
export const logSecurityEvent = (event: string, details: any) => {
    logger.warn({ securityEvent: event, ...details }, `Security event: ${event}`);
};

// Export default logger
export default logger;
