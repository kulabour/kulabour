"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSecurityEvent = exports.logUserAction = exports.logExternalCall = exports.logQuery = exports.logTiming = exports.createLogger = void 0;
const pino_1 = __importDefault(require("pino"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure logs directory exists
const logsDir = path_1.default.join(__dirname, '..', 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Determine environment
const isDevelopment = process.env.NODE_ENV !== 'production';
const logLevel = process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info');
// Base logger configuration
const loggerConfig = {
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
        err: pino_1.default.stdSerializers.err,
        req: pino_1.default.stdSerializers.req,
        res: pino_1.default.stdSerializers.res
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
                    destination: path_1.default.join(logsDir, 'combined.log'),
                    mkdir: true
                }
            },
            // Error logs only
            {
                target: 'pino/file',
                level: 'error',
                options: {
                    destination: path_1.default.join(logsDir, 'error.log'),
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
const logger = (0, pino_1.default)(loggerConfig);
/**
 * Create child logger with additional context
 * @param context - Additional context to include in all logs
 */
const createLogger = (context) => {
    return logger.child(context);
};
exports.createLogger = createLogger;
/**
 * Log with timing information
 * @param label - Label for the operation
 * @param fn - Function to time
 */
const logTiming = async (label, fn) => {
    const start = Date.now();
    try {
        const result = await fn();
        const duration = Date.now() - start;
        logger.info({ operation: label, duration }, `${label} completed in ${duration}ms`);
        return result;
    }
    catch (error) {
        const duration = Date.now() - start;
        logger.error({ operation: label, duration, error }, `${label} failed after ${duration}ms`);
        throw error;
    }
};
exports.logTiming = logTiming;
/**
 * Log database query
 */
const logQuery = (query, params, duration) => {
    logger.debug({ query, params, duration }, 'Database query executed');
};
exports.logQuery = logQuery;
/**
 * Log external API call
 */
const logExternalCall = (service, method, url, duration, status) => {
    logger.info({ service, method, url, duration, status }, `External API call: ${service}`);
};
exports.logExternalCall = logExternalCall;
/**
 * Log user action
 */
const logUserAction = (userId, action, details) => {
    logger.info({ userId, action, ...details }, `User action: ${action}`);
};
exports.logUserAction = logUserAction;
/**
 * Log security event
 */
const logSecurityEvent = (event, details) => {
    logger.warn({ securityEvent: event, ...details }, `Security event: ${event}`);
};
exports.logSecurityEvent = logSecurityEvent;
// Export default logger
exports.default = logger;
