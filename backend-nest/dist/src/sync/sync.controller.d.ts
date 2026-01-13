import { SyncService } from './sync.service';
import { SyncPushDto } from './dto/sync.dto';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    pullChanges(lastPulledAt: string): Promise<{
        changes: {
            services: {
                created: (import("mongoose").Document<unknown, {}, import("../services/schemas/service.schema").ServiceDocument, {}, {}> & import("../services/schemas/service.schema").Service & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                    _id: import("mongoose").Types.ObjectId;
                }> & {
                    __v: number;
                })[];
                updated: (import("mongoose").Document<unknown, {}, import("../services/schemas/service.schema").ServiceDocument, {}, {}> & import("../services/schemas/service.schema").Service & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                    _id: import("mongoose").Types.ObjectId;
                }> & {
                    __v: number;
                })[];
                deleted: never[];
            };
            bookings: {
                created: never[];
                updated: never[];
                deleted: never[];
            };
        };
        timestamp: number;
    }>;
    pushChanges(body: SyncPushDto): Promise<{
        success: boolean;
    }>;
}
