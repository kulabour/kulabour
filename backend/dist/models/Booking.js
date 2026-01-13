"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
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
exports.default = mongoose_1.default.model('Booking', bookingSchema);
