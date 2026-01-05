import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';

import { WorkersService } from '../workers/workers.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        private workersService: WorkersService
    ) { }

    async create(createBookingDto: any, user: any): Promise<Booking> {
        const booking = new this.bookingModel({
            ...createBookingDto,
            customerId: user.userId,
            customerName: user.name,
        });
        const savedBooking = await booking.save();

        // Find nearby workers using geolocation
        // TODO: Extract lat/lng from booking address or user location
        // Default location: New Delhi coordinates
        const defaultLat = 28.6139;
        const defaultLng = 77.2090;

        try {
            const nearbyWorkers = await this.workersService.findNearbyWorkers(defaultLat, defaultLng, 5000);
            console.log(`✅ Found ${nearbyWorkers.length} nearby workers within 5km`);

            // TODO: Send push notifications to nearby workers
        } catch (error) {
            console.error('❌ Error finding nearby workers:', error);
            // Don't fail the booking if worker lookup fails
        }

        return savedBooking;
    }

    async findAll(): Promise<Booking[]> {
        return this.bookingModel.find().exec();
    }

    async findOne(id: string): Promise<BookingDocument> {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
        return booking;
    }

    async countTotal(): Promise<number> {
        return this.bookingModel.countDocuments().exec();
    }

    async getTotalRevenue(): Promise<number> {
        const result = await this.bookingModel.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]).exec() as any;
        return result[0]?.total || 0;
    }

    async findRecent(limit: number = 5): Promise<Booking[]> {
        return this.bookingModel.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
}
