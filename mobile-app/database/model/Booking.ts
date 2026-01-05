import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, relation } from '@nozbe/watermelondb/decorators';
import Service from './Service';

export default class Booking extends Model {
    static table = 'bookings';

    @field('service_id') serviceId!: string;
    @field('customer_id') customerId!: string;
    @field('worker_id') workerId?: string;
    @field('status') status!: string;
    @field('total_amount') totalAmount!: number;
    @field('address') address!: string;

    @date('scheduled_at') scheduledAt!: Date;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;

    @field('is_synced') isSynced!: boolean;

    @relation('services', 'service_id') service!: Service;
}
