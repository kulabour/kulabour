export declare class HealthController {
    check(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
    };
    detailedCheck(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
        services: {
            database: string;
            redis: string;
            api: string;
        };
        memory: {
            used: number;
            total: number;
        };
    }>;
}
