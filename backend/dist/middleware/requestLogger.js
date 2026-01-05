"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.correlationMiddleware = exports.requestLogger = exports.httpLogger = void 0;
const pino_http_1 = __importDefault(require("pino-http"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * HTTP request logger middleware using pino-http
 */
exports.httpLogger = (0, pino_http_1.default)({
    logger: logger_1.default,
    // Generate correlation ID for each request
    genReqId: (req) => {
        const correlationId = (0, uuid_1.v4)();
        req.correlationId = correlationId;
        return correlationId;
    },
    // Custom request message
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err)
            return 'error';
        if (res.statusCode >= 400)
            return 'warn';
        return 'info';
    },
    // Custom success message
    customSuccessMessage: (req, res) => {
        return `${req.method} ${req.url} ${res.statusCode}`;
    },
    // Custom error message
    customErrorMessage: (req, res, err) => {
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
        req: (req) => ({
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
        res: (res) => ({
            statusCode: res.statusCode
        })
    },
    // Don't auto-log - we'll manually log to have more control
    autoLogging: {
        ignore: (req) => {
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
const requestLogger = (req, res, next) => {
    // Generate correlation ID
    req.correlationId = (0, uuid_1.v4)();
    // Capture start time
    const startTime = Date.now();
    // Log incoming request
    logger_1.default.info({
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
    res.send = function (data) {
        const duration = Date.now() - startTime;
        // Log response
        const logData = {
            correlationId: req.correlationId,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userId: req.user?._id?.toString()
        };
        // Log based on status code
        if (res.statusCode >= 500) {
            logger_1.default.error(logData, `← ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
        }
        else if (res.statusCode >= 400) {
            logger_1.default.warn(logData, `← ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
        }
        else {
            logger_1.default.info(logData, `← ${req.method} ${req.url} ${res.statusCode} (${duration}ms)`);
        }
        return originalSend.call(this, data);
    };
    next();
};
exports.requestLogger = requestLogger;
/**
 * Add correlation ID to response headers
 */
const correlationMiddleware = (req, res, next) => {
    if (req.correlationId) {
        res.setHeader('X-Correlation-ID', req.correlationId);
    }
    next();
};
exports.correlationMiddleware = correlationMiddleware;
