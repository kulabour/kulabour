import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Sentry must be imported and initialized FIRST
import { initSentry, sentryErrorHandler } from './config/sentry';

// Imports from local files
import { errorHandler, notFound } from './middleware/errorHandler';
// Note: logger import removed from top level if not used for startup messages here, but used for env checks
import logger, { logSecurityEvent } from './utils/logger';
import { requestLogger, correlationMiddleware } from './middleware/requestLogger';

import servicesRoutes from './routes/services';
import bookingsRoutes from './routes/bookings';
import verificationRoutes from './routes/verification';
import authRoutes from './routes/auth';
import paymentRoutes from './routes/payments';
import uploadRoutes from './routes/upload';
import chatRoutes from './routes/chat';

dotenv.config();

const app = express();
const API_VERSION = 'v1';

// Initialize Sentry (MUST be before any other middleware)
const sentryEnabled = initSentry(app);

// ===== SECURITY MIDDLEWARE =====

// 1. Request logging with correlation IDs
app.use(requestLogger);
app.use(correlationMiddleware);

// 2. Helmet
app.use(helmet({
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
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// 3. Response compression
app.use(compression());

// 4. CORS
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.CORS_ORIGINS || 'https://kulabour.com').split(',')
        : ['http://localhost:8081', 'http://localhost:3000', 'http://localhost:19006'],
    credentials: true,
    maxAge: 86400,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// 5. Body parser
app.use(express.json({
    limit: '10mb',
    strict: true
}));
app.use(express.urlencoded({
    extended: true,
    limit: '10mb',
    parameterLimit: 1000
}));

// 6. Data Sanitization
app.use(mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        logSecurityEvent('NoSQL Injection Attempt', { key, ip: req.ip, path: req.path });
    }
}) as any);

// 7. XSS Protection
app.use(xss());

// 8. HPP
app.use(hpp({
    whitelist: ['sort', 'filter', 'page', 'limit']
}));

// ===== RATE LIMITING =====
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests', message: 'You have exceeded the request limit. Please try again later.' },
    standardHeaders: true, legacyHeaders: false,
    skip: (req: Request) => req.path === '/health'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, max: 5, skipSuccessfulRequests: true,
    message: { error: 'Too many authentication attempts', message: 'Please wait 15 minutes before trying again.' },
    standardHeaders: true, legacyHeaders: false,
});

const passwordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, max: 3,
    message: { error: 'Too many password attempts', message: 'Please wait 1 hour before trying again.' },
    standardHeaders: true, legacyHeaders: false,
});

app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/auth/reset-password', passwordLimiter);

// ===== ROUTES =====
app.get('/health', (req: Request, res: Response) => {
    const dbStatus = mongoose.connection.readyState;
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        database: dbStatus === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV || 'development',
        version: API_VERSION
    });
});

app.get('/', (req: Request, res: Response) => {
    res.json({
        name: 'KULABOUR API',
        version: '1.0.0',
        apiVersion: API_VERSION,
        status: 'running',
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);

// Versioned routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/services`, servicesRoutes);
app.use(`/api/${API_VERSION}/bookings`, bookingsRoutes);

// ===== ERROR HANDLING =====
if (sentryEnabled) {
    app.use(sentryErrorHandler());
}
app.use(notFound);
app.use(errorHandler);

export default app;
