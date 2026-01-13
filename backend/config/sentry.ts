import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { Express } from 'express';

// Initialize Sentry
export const initSentry = (app?: Express) => {
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
            nodeProfilingIntegration(),
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
                const message = (error as Error).message;
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

// Error handler middleware (add AFTER all routes, BEFORE other error handlers)
export const sentryErrorHandler = () => {
    return (err: any, req: any, res: any, next: any) => {
        Sentry.captureException(err);
        next(err);
    };
};

// Manually capture exception with context
export const captureException = (error: Error, context?: {
    user?: { id: string; email?: string; username?: string };
    extra?: Record<string, any>;
    tags?: Record<string, string>;
    level?: Sentry.SeverityLevel;
}) => {
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
    } else {
        Sentry.captureException(error);
    }
};

// Add breadcrumb for debugging context
export const addBreadcrumb = (message: string, data?: Record<string, any>, level?: Sentry.SeverityLevel) => {
    Sentry.addBreadcrumb({
        message,
        data,
        level: level || 'info',
        timestamp: Date.now() / 1000,
    });
};

// Set user context
export const setUser = (userId: string, email?: string, username?: string) => {
    Sentry.setUser({
        id: userId,
        email,
        username,
    });
};

// Clear user context (e.g., on logout)
export const clearUser = () => {
    Sentry.setUser(null);
};

export { Sentry };
