import { OnModuleInit } from '@nestjs/common';
export declare class VoiceHealthService implements OnModuleInit {
    private readonly logger;
    private websocketConnections;
    private lastHealthStatus;
    onModuleInit(): void;
    trackConnection(connected: boolean): void;
    trackRequest(success: boolean, responseTime: number): void;
    runHealthCheck(): Promise<{
        status: string;
        timestamp: string;
        active_websockets: number;
        requests: {
            totalRequests: number;
            successfulRequests: number;
            failedRequests: number;
            averageResponseTime: number;
            lastChecked: Date;
        };
        issues: string[];
        auto_fixes_applied: string[];
    }>;
    getHealthStatus(): {
        timestamp: string;
        websockets: {
            active: number;
        };
        requests: {
            totalRequests: number;
            successfulRequests: number;
            failedRequests: number;
            averageResponseTime: number;
            lastChecked: Date;
        };
    };
    private resetMetrics;
}
