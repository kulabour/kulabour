/**
 * KULABOUR Performance Monitoring Service
 * Tracks render times, interaction latency, and startup performance
 * 
 * SENIOR PATTERN: Measure everything to optimize what matters
 */

import { InteractionManager } from 'react-native';
import { logger } from './ProductionLogger';

interface PerformanceMetric {
    name: string;
    startTime: number;
    duration?: number;
    metadata?: Record<string, any>;
}

class PerformanceMonitorService {
    private metrics: Map<string, PerformanceMetric> = new Map();
    private interactionParams: { name: string; startTime: number } | null = null;

    /**
     * Start measuring a metric
     */
    startTrace(name: string, metadata?: Record<string, any>): string {
        const id = `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.metrics.set(id, {
            name,
            startTime: performance.now(),
            metadata
        });
        return id;
    }

    /**
     * Stop measuring and log duration
     */
    stopTrace(id: string) {
        const metric = this.metrics.get(id);
        if (!metric) return;

        const duration = performance.now() - metric.startTime;
        this.metrics.delete(id);

        logger.info('Performance', `${metric.name} completed`, {
            durationMs: duration,
            ...metric.metadata
        });

        // In production, send slow traces to analytics
        if (duration > 100) { // Report distinct slow operations (>100ms)
            this.reportSlowTrace(metric.name, duration, metric.metadata);
        }
    }

    /**
     * Measure interaction responsiveness
     */
    startInteraction(name: string) {
        this.interactionParams = {
            name,
            startTime: performance.now()
        };

        InteractionManager.runAfterInteractions(() => {
            if (this.interactionParams && this.interactionParams.name === name) {
                const duration = performance.now() - this.interactionParams.startTime;

                logger.info('Performance', `Interaction: ${name}`, {
                    durationMs: duration
                });

                this.interactionParams = null;
            }
        });
    }

    private reportSlowTrace(name: string, duration: number, metadata?: any) {
        // TODO: Integrate with Sentry Performance
        // Sentry.captureMessage('Slow Operation', { level: 'warning', extra: { name, duration, metadata } });
    }
}

export const performanceMonitor = new PerformanceMonitorService();
