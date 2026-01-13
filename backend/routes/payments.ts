import express, { Request, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import Booking from '../models/Booking';
import { createOrder, verifyPayment, fetchPayment, createRefund, getKeyId, calculateCommission } from '../utils/razorpay';
import { sendPaymentReceived } from '../utils/notifications';
import { trackPaymentInitiated, trackPaymentCompleted, trackPaymentFailed } from '../utils/analytics';

const router = express.Router();

// Get Razorpay key for frontend
router.get('/key', asyncHandler(async (req: Request, res: Response) => {
    res.json({
        key: getKeyId()
    });
}));

// Create payment order
router.post('/create-order', authenticate, asyncHandler(async (req: Request, res: Response) => {
    const { bookingId, amount } = req.body;

    // Verify booking exists and belongs to user
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    // @ts-ignore
    if (booking.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create Razorpay order
    const order: any = await createOrder(amount, bookingId, {
        // @ts-ignore
        name: req.user.name,
        // @ts-ignore
        phone: req.user.mobile
    });

    trackPaymentInitiated(bookingId, {
        // @ts-ignore
        customerId: req.user._id.toString(),
        amount: amount,
        paymentMethod: 'razorpay'
    });

    res.json({
        success: true,
        order: {
            id: order.id,
            amount: order.amount,
            currency: order.currency
        }
    });
}));

// Verify payment
router.post('/verify', authenticate, asyncHandler(async (req: Request, res: Response) => {
    const { orderId, paymentId, signature, bookingId } = req.body;

    // Verify signature
    const isValid = verifyPayment(orderId, paymentId, signature);

    if (!isValid) {
        return res.status(400).json({
            success: false,
            error: 'Payment verification failed'
        });
    }

    // Update booking with payment info
    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    booking.payment = {
        orderId,
        paymentId,
        status: 'paid',
        paidAt: new Date()
    };

    booking.status = 'completed';
    await booking.save();

    // Track successful payment
    const platformFee = Math.round(booking.totalAmount * 0.15);
    trackPaymentCompleted(booking._id.toString(), {
        customerId: booking.customerId.toString(),
        workerId: booking.workerId?.toString() || 'unassigned',
        amount: booking.totalAmount,
        platformFee: platformFee,
        workerEarning: booking.totalAmount - platformFee,
        paymentMethod: 'razorpay'
    });

    // Calculate commission
    const commission = calculateCommission(booking.totalAmount);

    // Send notification to worker
    if (booking.workerId) {
        await sendPaymentReceived(booking.workerId, booking, commission.workerAmount);
    }

    res.json({
        success: true,
        message: 'Payment verified successfully',
        commission
    });
}));

// Request refund (customer cancellation)
router.post('/refund', authenticate, asyncHandler(async (req: Request, res: Response) => {
    const { bookingId, reason } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
    }

    // Authorization check
    // @ts-ignore
    if (booking.customerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    // Check if payment was made
    if (!booking.payment || !booking.payment.paymentId) {
        return res.status(400).json({ error: 'No payment found for this booking' });
    }

    // Check if already refunded
    if (booking.payment.refundId) {
        return res.status(400).json({ error: 'Refund already processed' });
    }

    // Calculate refund amount based on cancellation time
    let refundAmount = booking.totalAmount;
    const now = new Date();
    // @ts-ignore
    const scheduledTime = new Date(booking.scheduledTime);
    const hoursTillBooking = (scheduledTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Refund policy:
    // - More than 24 hours: 100% refund
    // - 12-24 hours: 50% refund
    // - Less than 12 hours: No refund
    if (hoursTillBooking < 12) {
        return res.status(400).json({
            error: 'No refund available',
            message: 'Cancellations less than 12 hours before booking are not eligible for refund'
        });
    } else if (hoursTillBooking < 24) {
        refundAmount = Math.round(booking.totalAmount * 0.5);
    }

    // Create refund
    const refund: any = await createRefund(booking.payment.paymentId, refundAmount);

    // Update booking
    booking.payment.refundId = refund.id;
    booking.payment.refundAmount = refundAmount;
    booking.payment.refundReason = reason;
    booking.status = 'cancelled';
    await booking.save();

    res.json({
        success: true,
        message: 'Refund processed successfully',
        refund: {
            amount: refundAmount,
            refundId: refund.id
        }
    });
}));

export default router;
