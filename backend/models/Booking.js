const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});

// Compound index for "My Bookings" query (most frequent)
bookingSchema.index({ customerId: 1, createdAt: -1 });

// Index for worker lookups
bookingSchema.index({ workerId: 1 });


module.exports = mongoose.model('Booking', bookingSchema);
