const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Booking = require('../models/Booking');
const { emitBookingUpdate, emitWorkerAssigned } = require('../websocket');
const { authenticateToken } = require('../middleware/auth');

// Validation Schemas
const createBookingSchema = Joi.object({
    serviceId: Joi.string().required(),
    serviceName: Joi.string().required(),
    customerId: Joi.string().required(),
    customerName: Joi.string().required(),
    address: Joi.string().required(),
    scheduledTime: Joi.string().required(), // ISO Date string validation could be stricter
    addOns: Joi.array().items(Joi.string()).optional(),
    totalAmount: Joi.number().positive().required()
});

const updateStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'in_progress', 'completed', 'cancelled').required(),
    workerId: Joi.string().optional(),
    workerName: Joi.string().optional()
});

// Create new booking (Protected)
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { error } = createBookingSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details[0].message });

        const { serviceId, serviceName, customerId, customerName, address, scheduledTime, addOns, totalAmount } = req.body;

        const newBooking = new Booking({
            serviceId,
            serviceName,
            customerId,
            customerName,
            address,
            scheduledTime,
            addOns: addOns || [],
            totalAmount,
            status: 'pending',
        });

        const savedBooking = await newBooking.save();

        res.status(201).json({
            success: true,
            data: savedBooking,
            message: 'Booking created successfully',
        });
    } catch (error) {
        next(error);
    }
});

// Get booking by ID (Protected)
router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
});

// Get all bookings for a user (Protected)
router.get('/user/:userId', authenticateToken, async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const bookings = await Booking.find({ customerId: req.params.userId })
            .sort({ createdAt: -1 }) // Most recent first
            .skip(skip)
            .limit(limit);

        const total = await Booking.countDocuments({ customerId: req.params.userId });

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
    } catch (error) {
        next(error);
    }
});

// Update booking status (Protected)
router.put('/:id/status', authenticateToken, async (req, res, next) => {
    try {
        const { error } = updateStatusSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details[0].message });

        const { status, workerId, workerName } = req.body;

        const updateData = { status };
        if (workerId) updateData.workerId = workerId;
        if (workerName) updateData.workerName = workerName;

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Return updated document
        );

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        // Emit WebSocket event for real-time update
        emitBookingUpdate(req.params.id, {
            bookingId: req.params.id,
            status: booking.status,
            workerName: booking.workerName,
            updatedAt: booking.updatedAt,
        });

        // If worker assigned, emit special event
        if (workerId && workerName) {
            emitWorkerAssigned(req.params.id, {
                workerId,
                workerName,
            });
        }

        res.json({
            success: true,
            data: booking,
            message: 'Booking updated successfully',
        });
    } catch (error) {
        next(error);
    }
});

// Cancel booking (Protected)
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: booking,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
