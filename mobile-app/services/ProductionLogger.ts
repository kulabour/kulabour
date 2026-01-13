/**
 * KULABOUR Production Logger
 * Replaces console.log with structured logging
 * Auto-silences in production, sends to analytics in dev
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    module: string;
    message: string;
    data?: any;
}

class ProductionLogger {
    private isProduction: boolean;
    private logBuffer: LogEntry[] = [];
    private readonly MAX_BUFFER = 100;

    constructor() {
        this.isProduction = !__DEV__;
    }

    /**
     * Debug log (dev only)
     */
    debug(module: string, message: string, data?: any) {
        this.log('debug', module, message, data);
    }

    /**
     * Info log
     */
    info(module: string, message: string, data?: any) {
        this.log('info', module, message, data);
    }

    /**
     * Warning log
     */
    warn(module: string, message: string, data?: any) {
        this.log('warn', module, message, data);
    }

    /**
     * Error log (always logged)
     */
    error(module: string, message: string, data?: any) {
        this.log('error', module, message, data);
        // In production, auto-send to error tracking
        if (this.isProduction) {
            this.sendToErrorTracking({ module, message, data });
        }
    }

    private log(level: LogLevel, module: string, message: string, data?: any) {
        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            module,
            message,
            data,
        };

        // Only show console in development
        if (!this.isProduction || level === 'error') {
            const prefix = this.getPrefix(level);
            if (data) {
                console.log(`${prefix} [${module}] ${message}`, data);
            } else {
                console.log(`${prefix} [${module}] ${message}`);
            }
        }

        // Buffer for analytics
        this.logBuffer.push(entry);
        if (this.logBuffer.length > this.MAX_BUFFER) {
            this.logBuffer.shift();
        }
    }

    private getPrefix(level: LogLevel): string {
        switch (level) {
            case 'debug': return '🔍';
            case 'info': return 'ℹ️';
            case 'warn': return '⚠️';
            case 'error': return '❌';
        }
    }

    private sendToErrorTracking(error: { module: string; message: string; data?: any }) {
        // TODO: Integrate with Sentry/Firebase Crashlytics
        // Sentry.captureMessage(error.message, { extra: error });
    }

    /**
     * Get recent logs for debugging
     */
    getRecentLogs(): LogEntry[] {
        return [...this.logBuffer];
    }

    /**
     * Clear log buffer
     */
    clearLogs() {
        this.logBuffer = [];
    }
}

// Export singleton
export const logger = new ProductionLogger();
export default ProductionLogger;
