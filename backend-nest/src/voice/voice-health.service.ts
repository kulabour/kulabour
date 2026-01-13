import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class VoiceHealthService implements OnModuleInit {
    private readonly logger = new Logger(VoiceHealthService.name);
    private websocketConnections = 0;
    private lastHealthStatus = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        lastChecked: new Date(),
    };

    onModuleInit() {
        this.logger.log('Voice Health Monitoring Service initialized');
        this.runHealthCheck();
    }

    /**
     * Track WebSocket connection
     */
    trackConnection(connected: boolean) {
        if (connected) {
            this.websocketConnections++;
        } else {
            this.websocketConnections = Math.max(0, this.websocketConnections - 1);
        }
    }

    /**
     * Track voice request
     */
    trackRequest(success: boolean, responseTime: number) {
        this.lastHealthStatus.totalRequests++;
        if (success) {
            this.lastHealthStatus.successfulRequests++;
        } else {
            this.lastHealthStatus.failedRequests++;
        }

        // Update average response time
        const total = this.lastHealthStatus.totalRequests;
        const currentAvg = this.lastHealthStatus.averageResponseTime;
        this.lastHealthStatus.averageResponseTime =
            (currentAvg * (total - 1) + responseTime) / total;
    }

    /**
     * Run every 5 minutes
     */
    @Cron(CronExpression.EVERY_5_MINUTES)
    async runHealthCheck() {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            active_websockets: this.websocketConnections,
            requests: this.lastHealthStatus,
            issues: [] as string[],
            auto_fixes_applied: [] as string[],
        };

        // Check success rate
        const successRate = this.lastHealthStatus.totalRequests > 0
            ? (this.lastHealthStatus.successfulRequests / this.lastHealthStatus.totalRequests) * 100
            : 100;

        if (successRate < 70 && this.lastHealthStatus.totalRequests > 10) {
            health.status = 'degraded';
            health.issues.push(`Low success rate: ${successRate.toFixed(1)}%`);
            this.logger.warn(`Voice service degraded: ${successRate.toFixed(1)}% success rate`);
        }

        // Check response time
        if (this.lastHealthStatus.averageResponseTime > 3000) {
            health.status = 'slow';
            health.issues.push(`Slow response: ${this.lastHealthStatus.averageResponseTime}ms avg`);
            this.logger.warn(`Voice service slow: ${this.lastHealthStatus.averageResponseTime}ms avg response`);
        }

        // Auto-fix: Reset metrics if they're getting stale (>1 hour)
        const timeSinceCheck = Date.now() - this.lastHealthStatus.lastChecked.getTime();
        if (timeSinceCheck > 3600000) {
            this.resetMetrics();
            health.auto_fixes_applied.push('Reset stale metrics');
        }

        this.lastHealthStatus.lastChecked = new Date();
        return health;
    }

    /**
     * Get current health status
     */
    getHealthStatus() {
        return {
            timestamp: new Date().toISOString(),
            websockets: {
                active: this.websocketConnections,
            },
            requests: this.lastHealthStatus,
        };
    }

    /**
     * Reset metrics
     */
    private resetMetrics() {
        this.lastHealthStatus = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            lastChecked: new Date(),
        };
        this.logger.log('Health metrics reset');
    }
}
