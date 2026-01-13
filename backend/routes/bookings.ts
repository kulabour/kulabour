import express, { Request, Response } from 'express';
import Booking from '../models/Booking';
import User from '../models/User';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createBookingSchema, updateBookingSchema } from '../validation/schemas';
import { asyncHandler } from '../middleware/errorHandler';
import { emitBookingUpdate, emitWorkerAssigned } from '../websocket';
import { sendBookingCreated, sendWorkerAssigned, sendBookingStatusUpdate } from '../utils/notifications';
import {
    trackBookingCreated,
    trackBookingAccepted,
    trackBookingCompleted,
    trackBookingCancelled
} from '../utils/analytics';

const router = express.Router();

// Get all bookings (with filtering)
router.get('/', authenticate, authorize('customer', 'worker', 'admin'), asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const { role, _id: userId } = req.user;

    // Build query based on role
    let query: any = {};
    if (role === 'customer') {
        query.customerId = userId;
    } else if (role === 'worker') {
        query.workerId = userId;
    }
    // Admin sees all bookings (no filter)

    // Optional status filter
    if (req.query.status) {
        query.status = req.query.status;
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const bookings = await Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // Faster query

    const total = await Booking.countDocuments(query);

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
router.get('/:id', authenticate, asyncHandler(async (req: Request, res: Response) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    // Authorization: Only customer, worker, or admin can view
    // @ts-ignore
    const { role, _id: userId } = req.user;
    const isAuthorized =
        role === 'admin' ||
        booking.customerId.toString() === userId.toString() ||
        booking.workerId?.toString() === userId.toString();

    if (!isAuthorized) {
        return res.status(403).json({ error: 'Forbidden', message: 'You do not have access to this booking' });
    }

    res.json({ success: true, data: booking });
}));

// Create booking
router.post('/',
    authenticate,
    authorize('customer'),
    validate(createBookingSchema),
    asyncHandler(async (req: Request, res: Response) => {
        // Use validated data
        const bookingData = {
            ...req.validatedBody,
            // @ts-ignore
            customerId: req.user._id,
            // @ts-ignore
            customerName: req.user.name || req.user.profile?.name || 'Customer'
        };

        const booking = new Booking(bookingData);
        await booking.save();

        // Find nearby workers (TODO: Add geospatial query when location field exists)
        // For now, just find verified workers
        const nearbyWorkers = await User.find({
            userType: 'worker',
            isVerified: true,
        }).limit(10);

        // Send push notifications to nearby workers
        for (const worker of nearbyWorkers) {
            await sendBookingCreated((worker._id as unknown) as string, booking);
        }

        // Track booking creation
        trackBookingCreated(booking._id.toString(), {
            customerId: req.user!._id.toString(),
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
    })
);

// Worker accepts booking
router.put('/:id/accept',
    authenticate,
    authorize('worker'),
    asyncHandler(async (req: Request, res: Response) => {
        const booking = await Booking.findById(req.params.id);

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
        emitWorkerAssigned(req.params.id, {
            // @ts-ignore
            workerId: req.user._id,
            workerName: booking.workerName
        });

        // Send push notification to customer
        await sendWorkerAssigned(booking.customerId, booking);

        // Track acceptance
        trackBookingAccepted(booking._id.toString(), {
            workerId: req.user!._id.toString(),
            customerId: booking.customerId.toString(),
            serviceName: booking.serviceName,
            responseTime: (Date.now() - new Date(booking.createdAt).getTime()) / 1000
        });

        // Track acceptance
        trackBookingAccepted(booking._id.toString(), {
            workerId: req.user!._id.toString(),
            customerId: booking.customerId.toString(),
            serviceName: booking.serviceName,
            responseTime: (Date.now() - new Date(booking.createdAt).getTime()) / 1000
        });

        res.json({
            success: true,
            data: booking,
            message: 'Booking accepted successfully'
        });
    })
);

// Update booking status
router.put('/:id/status',
    authenticate,
    asyncHandler(async (req: Request, res: Response) => {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

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
        emitBookingUpdate(req.params.id, {
            bookingId: req.params.id,
            status: booking.status,
            updatedAt: booking.updatedAt
        });

        // Send push notifications
        const recipientId = isWorker ? booking.customerId : booking.workerId;
        if (recipientId) {
            await sendBookingStatusUpdate(recipientId, booking, status);
        }

        res.json({
            success: true,
            data: booking,
            message: 'Status updated successfully'
        });
    })
);

// Cancel booking
router.delete('/:id',
    authenticate,
    asyncHandler(async (req: Request, res: Response) => {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        // Authorization: Only customer or worker can cancel
        // @ts-ignore
        const { _id: userId } = req.user;
        const canCancel =
            booking.customerId.toString() === userId.toString() ||
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
    })
);

export default router;
