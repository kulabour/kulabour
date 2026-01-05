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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sentry = exports.clearUser = exports.setUser = exports.addBreadcrumb = exports.captureException = exports.sentryErrorHandler = exports.initSentry = void 0;
const Sentry = __importStar(require("@sentry/node"));
exports.Sentry = Sentry;
const profiling_node_1 = require("@sentry/profiling-node");
// Initialize Sentry
const initSentry = (app) => {
    if (!process.env.SENTRY_DSN_BACKEND) {
        console.warn('⚠️  Sentry not configured. Set SENTRY_DSN_BACKEND in .env');
        return false;
    }
    Sentry.init({
        dsn: process.env.SENTRY_DSN_BACKEND,
        environment: process.env.NODE_ENV || 'development',
        // Performance Monitoring
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        // Profiling
        profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        integrations: [
            (0, profiling_node_1.nodeProfilingIntegration)(),
        ],
        // Release tracking
        release: process.env.npm_package_version || '1.0.0',
        // Error filtering
        beforeSend(event, hint) {
            // Don't send errors in development unless explicitly enabled
            if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEV) {
                return null;
            }
            // Filter out known non-critical errors
            const error = hint.originalException;
            if (error && typeof error === 'object' && 'message' in error) {
                const message = error.message;
                if (message?.includes('ECONNREFUSED') && message?.includes('Redis')) {
                    // Don't send Redis connection errors to Sentry
                    return null;
                }
            }
            return event;
        },
        // Add custom tags
        initialScope: {
            tags: {
                service: 'kulabour-backend',
                nodeVersion: process.version,
            },
        },
    });
    // Add Express integration if app provided
    if (app) {
        // v8 integration
        Sentry.setupExpressErrorHandler(app);
    }
    console.log('✅ Sentry initialized');
    return true;
};
exports.initSentry = initSentry;
// Error handler middleware (add AFTER all routes, BEFORE other error handlers)
const sentryErrorHandler = () => {
    return (err, req, res, next) => {
        Sentry.captureException(err);
        next(err);
    };
};
exports.sentryErrorHandler = sentryErrorHandler;
// Manually capture exception with context
const captureException = (error, context) => {
    if (context) {
        Sentry.withScope((scope) => {
            if (context.user) {
                scope.setUser(context.user);
            }
            if (context.extra) {
                scope.setExtras(context.extra);
            }
            if (context.tags) {
                scope.setTags(context.tags);
            }
            if (context.level) {
                scope.setLevel(context.level);
            }
            Sentry.captureException(error);
        });
    }
    else {
        Sentry.captureException(error);
    }
};
exports.captureException = captureException;
// Add breadcrumb for debugging context
const addBreadcrumb = (message, data, level) => {
    Sentry.addBreadcrumb({
        message,
        data,
        level: level || 'info',
        timestamp: Date.now() / 1000,
    });
};
exports.addBreadcrumb = addBreadcrumb;
// Set user context
const setUser = (userId, email, username) => {
    Sentry.setUser({
        id: userId,
        email,
        username,
    });
};
exports.setUser = setUser;
// Clear user context (e.g., on logout)
const clearUser = () => {
    Sentry.setUser(null);
};
exports.clearUser = clearUser;
