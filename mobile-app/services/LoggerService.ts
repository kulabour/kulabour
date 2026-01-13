/**
 * KULABOUR Logger Service
 * Provides structured logging for the application.
 * 
 * Usage:
 * logger.info('Auth', 'User logged in', { userId: '123' });
 * logger.error('Payment', 'Transaction failed', error, { amount: 500 });
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    context: string;
    message: string;
    meta?: any;
    error?: any;
}

class LoggerService {
    private logs: LogEntry[] = [];
    private readonly MAX_LOGS = 100; // Keep last 100 logs in memory for issue reporting

    private formatEntry(level: LogLevel, context: string, message: string, meta?: any, error?: any): LogEntry {
        return {
            timestamp: new Date().toISOString(),
            level,
            context,
            message,
            meta,
            error: error instanceof Error ? { message: error.message, stack: error.stack } : error,
        };
    }

    private log(level: LogLevel, context: string, message: string, meta?: any, error?: any) {
        const entry = this.formatEntry(level, context, message, meta, error);

        // Console output (Development)
        const prefix = `[${entry.timestamp.split('T')[1].split('.')[0]}] [${level}] [${context}]`;

        switch (level) {
            case 'DEBUG':
                console.debug(prefix, message, meta || '');
                break;
            case 'INFO':
                console.info(prefix, message, meta || '');
                break;
            case 'WARN':
                console.warn(prefix, message, meta || '');
                break;
            case 'ERROR':
                console.error(prefix, message, meta || '', error || '');
                break;
        }

        // Store in memory
        this.logs.push(entry);
        if (this.logs.length > this.MAX_LOGS) {
            this.logs.shift();
        }

        // TODO: Send to remote logging service (Splunk/Datadog/Sentry) in Prod
        // if (process.env.NODE_ENV === 'production') { ... }
    }

    debug(context: string, message: string, meta?: any) {
        this.log('DEBUG', context, message, meta);
    }

    info(context: string, message: string, meta?: any) {
        this.log('INFO', context, message, meta);
    }

    warn(context: string, message: string, meta?: any) {
        this.log('WARN', context, message, meta);
    }

    error(context: string, message: string, error?: any, meta?: any) {
        this.log('ERROR', context, message, meta, error);
    }

    /**
     * Get recent logs (for Error Boundary or Feedback)
     */
    getRecentLogs(): LogEntry[] {
        return [...this.logs];
    }
}

export const logger = new LoggerService();
