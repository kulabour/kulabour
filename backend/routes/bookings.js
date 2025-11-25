const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { emitBookingUpdate, emitWorkerAssigned } = require('../websocket');

// Create new booking
router.post('/', async (req, res) => {
    try {
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
        console.error('Booking creation error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create booking',
            message: error.message,
        });
    }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch booking' });
    }
});

// Get all bookings for a user
router.get('/user/:userId', async (req, res) => {
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
        res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
    }
});

// Update booking status
router.put('/:id/status', async (req, res) => {
    try {
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
        res.status(500).json({ success: false, error: 'Failed to update booking' });
    }
});

// Cancel booking
router.delete('/:id', async (req, res) => {
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
        res.status(500).json({ success: false, error: 'Failed to cancel booking' });
    }
});

module.exports = router;
