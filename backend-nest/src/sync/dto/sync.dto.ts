export class SyncPullQueryDto {
    last_pulled_at: number;
}

export class SyncPushDto {
    changes: {
        services: { created: any[]; updated: any[]; deleted: string[] };
        bookings: { created: any[]; updated: any[]; deleted: string[] };
    };
    last_pulled_at: number;
}
