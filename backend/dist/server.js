"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Sentry must be imported and initialized FIRST
const sentry_1 = require("./config/sentry");
// Imports from local files
const database_1 = __importDefault(require("./config/database"));
const websocket_1 = require("./websocket");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importStar(require("./utils/logger"));
const requestLogger_1 = require("./middleware/requestLogger");
// ===== ENVIRONMENT VALIDATION =====
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
requiredEnvVars.forEach(key => {
    if (!process.env[key]) {
        logger_1.default.fatal({ missingVar: key }, `Missing required environment variable: ${key}`);
        process.exit(1);
    }
});
// Validate JWT_SECRET strength
if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    logger_1.default.warn('JWT_SECRET should be at least 32 characters for security');
}
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Create HTTP server for Socket.IO
const server = http_1.default.createServer(app);
// Initialize WebSocket
(0, websocket_1.initializeWebSocket)(server);
// Initialize Sentry (MUST be before any other middleware)
const sentryEnabled = (0, sentry_1.initSentry)(app);
// Import routes
const services_1 = __importDefault(require("./routes/services"));
const bookings_1 = __importDefault(require("./routes/bookings"));
const verification_1 = __importDefault(require("./routes/verification"));
const auth_1 = __importDefault(require("./routes/auth"));
const payments_1 = __importDefault(require("./routes/payments"));
const upload_1 = __importDefault(require("./routes/upload"));
const chat_1 = __importDefault(require("./routes/chat"));
// ===== SECURITY MIDDLEWARE (ORDER MATTERS!) =====
// 1. Request logging with correlation IDs
app.use(requestLogger_1.requestLogger);
app.use(requestLogger_1.correlationMiddleware);
// 2. Helmet - Security headers with enhanced CSP
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "wss:", "https:"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false, // For mobile app compatibility
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    }
}));
// 3. Response compression
app.use((0, compression_1.default)());
// 4. CORS - Properly configured
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.CORS_ORIGINS || 'https://kulabour.com').split(',')
        : ['http://localhost:8081', 'http://localhost:3000', 'http://localhost:19006'],
    credentials: true,
    maxAge: 86400, // 24 hours
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use((0, cors_1.default)(corsOptions));
// 5. Body parser with strict limits
app.use(express_1.default.json({
    limit: '10mb',
    strict: true // Only accept arrays and objects
}));
app.use(express_1.default.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 1000 // Limit number of parameters
}));
// 6. Data Sanitization - Prevent NoSQL injection
app.use((0, express_mongo_sanitize_1.default)({
    replaceWith: '_', // Replace prohibited characters
    onSanitize: ({ req, key }) => {
        (0, logger_1.logSecurityEvent)('NoSQL Injection Attempt', { key, ip: req.ip, path: req.path });
    }
})); // Type cast due to potential type mismatch in older typings
// 7. XSS Protection - Clean user input
app.use((0, xss_clean_1.default)());
// 8. HTTP Parameter Pollution protection
app.use((0, hpp_1.default)({
    whitelist: ['sort', 'filter', 'page', 'limit'] // Allow these to be arrays
}));
// ===== RATE LIMITING =====
// General API rate limit
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: {
        error: 'Too many requests',
        message: 'You have exceeded the request limit. Please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.path === '/health' // Skip health checks
});
// Strict rate limit for auth routes
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 OTP requests per IP
    skipSuccessfulRequests: true,
    message: {
        error: 'Too many authentication attempts',
        message: 'Please wait 15 minutes before trying again.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Very strict limit for password-related routes
const passwordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: {
        error: 'Too many password attempts',
        message: 'Please wait 1 hour before trying again.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
// Apply rate limiters
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/auth/reset-password', passwordLimiter);
// ===== API VERSIONING =====
const API_VERSION = 'v1';
// ===== ROUTES =====
// Health check (no rate limit, no auth)
app.get('/health', (req, res) => {
    const dbStatus = mongoose_1.default.connection.readyState;
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: API_VERSION,
        security: {
            helmet: true,
            cors: true,
            rateLimit: true,
            mongoSanitize: true,
            xss: true,
            hpp: true
        }
    });
});
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'KULABOUR API',
        version: '1.0.0',
        apiVersion: API_VERSION,
        status: 'running',
        documentation: '/api/docs',
        security: '100%'
    });
});
// API routes (with version prefix support)
app.use('/api/auth', auth_1.default);
app.use('/api/services', services_1.default);
app.use('/api/bookings', bookings_1.default);
app.use('/api/verification', verification_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/chat', chat_1.default);
// Versioned routes (future-proofing)
app.use(`/api/${API_VERSION}/auth`, auth_1.default);
app.use(`/api/${API_VERSION}/services`, services_1.default);
app.use(`/api/${API_VERSION}/bookings`, bookings_1.default);
// ===== ERROR HANDLING (MUST BE LAST!) =====
// Sentry error handler (MUST be after routes, BEFORE other error handlers)
if (sentryEnabled) {
    app.use((0, sentry_1.sentryErrorHandler)());
}
// 404 handler
app.use(errorHandler_1.notFound);
// Global error handler
app.use(errorHandler_1.errorHandler);
// ===== START SERVER =====
(0, database_1.default)().then(() => {
    server.listen(PORT, () => {
        logger_1.default.info({
            port: PORT,
            environment: process.env.NODE_ENV || 'development',
            apiVersion: API_VERSION,
            security: {
                helmet: true,
                cors: true,
                rateLimit: true,
                mongoSanitize: true,
                xss: true,
                hpp: true
            }
        }, `KULABOUR Backend Server started on port ${PORT}`);
    });
}).catch((err) => {
    logger_1.default.fatal({ error: err.message }, 'Failed to start server');
    process.exit(1);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM received. Closing server gracefully...');
    server.close(() => {
        logger_1.default.info('Server closed');
        process.exit(0);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger_1.default.fatal({ error: err }, 'Uncaught Exception');
    process.exit(1);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.fatal({ reason, promise: promise.toString() }, 'Unhandled Rejection');
    process.exit(1);
});
