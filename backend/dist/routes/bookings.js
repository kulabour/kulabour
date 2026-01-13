"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Booking_1 = __importDefault(require("../models/Booking"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const errorHandler_1 = require("../middleware/errorHandler");
const websocket_1 = require("../websocket");
const notifications_1 = require("../utils/notifications");
const analytics_1 = require("../utils/analytics");
const router = express_1.default.Router();
// Get all bookings (with filtering)
router.get('/', auth_1.authenticate, (0, auth_1.authorize)('customer', 'worker', 'admin'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // @ts-ignore
    const { role, _id: userId } = req.user;
    // Build query based on role
    let query = {};
    if (role === 'customer') {
        query.customerId = userId;
    }
    else if (role === 'worker') {
        query.workerId = userId;
    }
    // Admin sees all bookings (no filter)
    // Optional status filter
    if (req.query.status) {
        query.status = req.query.status;
    }
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const bookings = await Booking_1.default.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // Faster query
    const total = await Booking_1.default.countDocuments(query);
    res.json({
        success: true,
        data: bookings,
        pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total,
            limit
        }
    });
}));
// Get single booking
router.get('/:id', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const booking = await Booking_1.default.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    // Authorization: Only customer, worker, or admin can view
    // @ts-ignore
    const { role, _id: userId } = req.user;
    const isAuthorized = role === 'admin' ||
        booking.customerId.toString() === userId.toString() ||
        booking.workerId?.toString() === userId.toString();
    if (!isAuthorized) {
        return res.status(403).json({ error: 'Forbidden', message: 'You do not have access to this booking' });
    }
    res.json({ success: true, data: booking });
}));
// Create booking
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('customer'), (0, validate_1.validate)(schemas_1.createBookingSchema), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // Use validated data
    const bookingData = {
        ...req.validatedBody,
        // @ts-ignore
        customerId: req.user._id,
        // @ts-ignore
        customerName: req.user.name || req.user.profile?.name || 'Customer'
    };
    const booking = new Booking_1.default(bookingData);
    await booking.save();
    // Find nearby workers (TODO: Add geospatial query when location field exists)
    // For now, just find verified workers
    const nearbyWorkers = await User_1.default.find({
        userType: 'worker',
        isVerified: true,
    }).limit(10);
    // Send push notifications to nearby workers
    for (const worker of nearbyWorkers) {
        await (0, notifications_1.sendBookingCreated)(worker._id, booking);
    }
    // Track booking creation
    (0, analytics_1.trackBookingCreated)(booking._id.toString(), {
        customerId: req.user._id.toString(),
        serviceId: booking.serviceId.toString(),
        serviceName: booking.serviceName,
        amount: booking.totalAmount,
        location: booking.address
    });
    res.status(201).json({
        success: true,
        data: booking,
        message: 'Booking created successfully'
    });
}));
// Worker accepts booking
router.put('/:id/accept', auth_1.authenticate, (0, auth_1.authorize)('worker'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const booking = await Booking_1.default.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    if (booking.status !== 'pending') {
        return res.status(400).json({
            error: 'Booking cannot be accepted',
            message: `Booking is already ${booking.status}`
        });
    }
    // @ts-ignore
    booking.workerId = req.user._id;
    // @ts-ignore
    booking.workerName = req.user.name || req.user.profile?.name || 'Worker';
    booking.status = 'accepted';
    await booking.save();
    // Emit real-time update
    (0, websocket_1.emitWorkerAssigned)(req.params.id, {
        // @ts-ignore
        workerId: req.user._id,
        workerName: booking.workerName
    });
    // Send push notification to customer
    await (0, notifications_1.sendWorkerAssigned)(booking.customerId, booking);
    // Track acceptance
    (0, analytics_1.trackBookingAccepted)(booking._id.toString(), {
        workerId: req.user._id.toString(),
        customerId: booking.customerId.toString(),
        serviceName: booking.serviceName,
        responseTime: (Date.now() - new Date(booking.createdAt).getTime()) / 1000
    });
    // Track acceptance
    (0, analytics_1.trackBookingAccepted)(booking._id.toString(), {
        workerId: req.user._id.toString(),
        customerId: booking.customerId.toString(),
        serviceName: booking.serviceName,
        responseTime: (Date.now() - new Date(booking.createdAt).getTime()) / 1000
    });
    res.json({
        success: true,
        data: booking,
        message: 'Booking accepted successfully'
    });
}));
// Update booking status
router.put('/:id/status', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    const booking = await Booking_1.default.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    // Authorization check
    // @ts-ignore
    const { role, _id: userId } = req.user;
    const isCustomer = booking.customerId.toString() === userId.toString();
    const isWorker = booking.workerId?.toString() === userId.toString();
    const isAdmin = role === 'admin';
    if (!isCustomer && !isWorker && !isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const oldStatus = booking.status;
    booking.status = status;
    await booking.save();
    // Emit real-time update
    (0, websocket_1.emitBookingUpdate)(req.params.id, {
        bookingId: req.params.id,
        status: booking.status,
        updatedAt: booking.updatedAt
    });
    // Send push notifications
    const recipientId = isWorker ? booking.customerId : booking.workerId;
    if (recipientId) {
        await (0, notifications_1.sendBookingStatusUpdate)(recipientId, booking, status);
    }
    res.json({
        success: true,
        data: booking,
        message: 'Status updated successfully'
    });
}));
// Cancel booking
router.delete('/:id', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const booking = await Booking_1.default.findById(req.params.id);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    // Authorization: Only customer or worker can cancel
    // @ts-ignore
    const { _id: userId } = req.user;
    const canCancel = booking.customerId.toString() === userId.toString() ||
        booking.workerId?.toString() === userId.toString();
    if (!canCancel) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    if (booking.status === 'completed' || booking.status === 'cancelled') {
        return res.status(400).json({
            error: 'Cannot cancel',
            message: `Booking is already ${booking.status}`
        });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
    });
}));
exports.default = router;
