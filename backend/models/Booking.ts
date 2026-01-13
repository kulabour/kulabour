import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
    serviceId: number;
    serviceName: string;
    customerId: string; // Stored as string in schema, ref to User
    customerName: string;
    workerId?: string; // Stored as string in schema, ref to User
    workerName?: string;
    address: string;
    scheduledTime: Date;
    addOns: Array<{
        id: number;
        name: string;
        price: number;
    }>;
    totalAmount: number;
    status: 'pending' | 'accepted' | 'arriving' | 'in_progress' | 'completed' | 'cancelled';
    payment?: {
        orderId?: string;
        paymentId?: string;
        status?: string;
        paidAt?: Date;
        refundId?: string;
        refundAmount?: number;
        refundReason?: string;
    }; // Added from payments.js context
    createdAt: Date;
    updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
    serviceId: {
        type: Number,
        required: true,
    },
    serviceName: {
        type: String,
        required: true,
    },
    customerId: {
        type: String,
        required: true,
        ref: 'User',
    },
    customerName: {
        type: String,
        required: true,
    },
    workerId: {
        type: String,
        ref: 'User',
    },
    workerName: String,
    address: {
        type: String,
        required: true,
    },
    scheduledTime: {
        type: Date,
        required: true,
    },
    addOns: [{
        id: Number,
        name: String,
        price: Number,
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
    },
    // Adding payment field structure inferred from payments.js
    payment: {
        orderId: String,
        paymentId: String,
        status: String,
        paidAt: Date,
        refundId: String,
        refundAmount: Number,
        refundReason: String,
    }
}, {
    timestamps: true,
});

// ===== DATABASE INDEXES FOR PERFORMANCE =====

// Most common query: Get bookings for a customer, sorted by date
bookingSchema.index({ customerId: 1, createdAt: -1 });

// Worker queries: Get worker's bookings by status
bookingSchema.index({ workerId: 1, status: 1, createdAt: -1 });

// Admin/Analytics: Filter by status and date
bookingSchema.index({ status: 1, createdAt: -1 });

// Search bookings by service
bookingSchema.index({ serviceId: 1, status: 1 });

// Text search on service name and address (for search functionality)
bookingSchema.index({ serviceName: 'text', address: 'text' });

// Scheduled time index (for upcoming bookings)
bookingSchema.index({ scheduledTime: 1, status: 1 });

export default mongoose.model<IBooking>('Booking', bookingSchema);
