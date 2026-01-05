"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Message_1 = __importDefault(require("../models/Message"));
const Booking_1 = __importDefault(require("../models/Booking"));
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
// Get chat history for a booking
router.get('/:bookingId', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { bookingId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    // Verify access
    const booking = await Booking_1.default.findById(bookingId);
    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }
    // @ts-ignore
    const { role, _id: userId } = req.user;
    const isParticipant = booking.customerId.toString() === userId.toString() ||
        booking.workerId?.toString() === userId.toString() ||
        role === 'admin';
    if (!isParticipant) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    // Fetch messages
    const messages = await Message_1.default.find({ bookingId })
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
router.put('/:bookingId/read', auth_1.authenticate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { bookingId } = req.params;
    // @ts-ignore
    const userId = req.user._id;
    await Message_1.default.updateMany({
        bookingId,
        senderId: { $ne: userId },
        readBy: { $ne: userId }
    }, { $addToSet: { readBy: userId } });
    res.json({ success: true });
}));
exports.default = router;
