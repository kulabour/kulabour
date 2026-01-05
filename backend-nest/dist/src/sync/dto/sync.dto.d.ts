export declare class SyncPullQueryDto {
    last_pulled_at: number;
}
export declare class SyncPushDto {
    changes: {
        services: {
            created: any[];
            updated: any[];
            deleted: string[];
        };
        bookings: {
            created: any[];
            updated: any[];
            deleted: string[];
        };
    };
    last_pulled_at: number;
}
