import { Model } from 'mongoose';
import { Service, ServiceDocument } from '../services/schemas/service.schema';
export declare class SyncService {
    private serviceModel;
    constructor(serviceModel: Model<ServiceDocument>);
    pullChanges(lastPulledAt: number): Promise<{
        changes: {
            services: {
                created: (import("mongoose").Document<unknown, {}, ServiceDocument, {}, {}> & Service & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                    _id: import("mongoose").Types.ObjectId;
                }> & {
                    __v: number;
                })[];
                updated: (import("mongoose").Document<unknown, {}, ServiceDocument, {}, {}> & Service & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    pushChanges(changes: any): Promise<void>;
}
