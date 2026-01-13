import express, { Request, Response } from 'express';
import Message from '../models/Message';
import Booking from '../models/Booking';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get chat history for a booking
router.get('/:bookingId', authenticate, asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    // Verify access
    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    // @ts-ignore
    const { role, _id: userId } = req.user;
    const isParticipant =
        booking.customerId.toString() === userId.toString() ||
        booking.workerId?.toString() === userId.toString() ||
        role === 'admin';

    if (!isParticipant) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Fetch messages
    const messages = await Message.find({ bookingId })
        .sort({ createdAt: -1 }) // Newest first
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

    res.json({
        success: true,
        data: messages.reverse(), // Return oldest first for UI
        pagination: {
            page: page,
            limit: limit
        }
    });
}));

// Mark messages as read
router.put('/:bookingId/read', authenticate, asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    // @ts-ignore
    const userId = req.user._id;

    await Message.updateMany(
        {
            bookingId,
            senderId: { $ne: userId },
            readBy: { $ne: userId }
        },
        { $addToSet: { readBy: userId } }
    );

    res.json({ success: true });
}));

export default router;
