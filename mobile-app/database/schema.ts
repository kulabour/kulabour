import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
    version: 1,
    tables: [
        tableSchema({
            name: 'services',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'category', type: 'string' },
                { name: 'price', type: 'number' },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'image_url', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),
        tableSchema({
            name: 'bookings',
            columns: [
                { name: 'service_id', type: 'string' },
                { name: 'customer_id', type: 'string' },
                { name: 'worker_id', type: 'string', isOptional: true },
                { name: 'status', type: 'string' }, // pending, accepted, completed, cancelled
                { name: 'total_amount', type: 'number' },
                { name: 'scheduled_at', type: 'number' },
                { name: 'address', type: 'string' },
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                // Offline sync flags
                { name: 'is_synced', type: 'boolean' },
                { name: 'sync_status', type: 'string', isOptional: true },
            ],
        }),
        tableSchema({
            name: 'workers',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'mobile', type: 'string' },
                { name: 'rating', type: 'number' },
                { name: 'profession', type: 'string' },
                { name: 'is_verified', type: 'boolean' },
                { name: 'profile_image', type: 'string', isOptional: true },
            ],
        }),
    ],
});
