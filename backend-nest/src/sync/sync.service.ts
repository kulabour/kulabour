import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from '../services/schemas/service.schema';

@Injectable()
export class SyncService {
    constructor(
        @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
        // In a real app, inject BookingModel too
    ) { }

    async pullChanges(lastPulledAt: number) {
        const timestamp = new Date(lastPulledAt);

        // Fetch modified services
        // Note: This requires soft-deletes implementation for 'deleted' tracking
        // For MVP, we only send created/updated
        const createdServices = await this.serviceModel.find({
            createdAt: { $gt: timestamp }
        }).exec();

        const updatedServices = await this.serviceModel.find({
            updatedAt: { $gt: timestamp },
            createdAt: { $lte: timestamp }
        }).exec();

        return {
            changes: {
                services: {
                    created: createdServices,
                    updated: updatedServices,
                    deleted: [], // TODO: Implement deleted tracking
                },
                bookings: {
                    created: [],
                    updated: [],
                    deleted: [],
                },
            },
            timestamp: Date.now(),
        };
    }

    async pushChanges(changes: any) {
        // Apply changes to database
        // This logic needs to be robust to handle conflicts
        // For MVP, we'll log the push
        console.log('Received changes to sync:', JSON.stringify(changes, null, 2));

        // Example: Process service creations
        if (changes.services?.created?.length > 0) {
            for (const service of changes.services.created) {
                // await this.serviceModel.create(service);
            }
        }
    }
}
