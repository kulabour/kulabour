import Razorpay from 'razorpay';
import crypto from 'crypto';
import logger from './logger';

// Initialize Razorpay (with placeholder - add your keys)
let razorpayInitialized = false;
let razorpay: Razorpay | null = null;

try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        razorpayInitialized = true;
        logger.info('✅ Razorpay initialized');
    } else {
        logger.warn('⚠️  Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
} catch (error: any) {
    logger.warn({ data: error.message }, '⚠️  Razorpay initialization failed:');
}

/**
 * Create a Razorpay order for a booking
 * @param {number} amount - Amount in INR
 * @param {string} bookingId - Booking ID
 * @param {object} customerInfo - Customer details
 */
export const createOrder = async (amount: number, bookingId: string, customerInfo: any = {}) => {
    if (!razorpayInitialized || !razorpay) {
        logger.info('💳 [MOCK] Would create Razorpay order for ₹' + amount);
        return {
            id: 'order_mock_' + Date.now(),
            amount: amount * 100,
            currency: 'INR',
            receipt: `booking_${bookingId}`,
            status: 'created'
        };
    }

    const options = {
        amount: amount * 100, // Amount in paise (INR * 100)
        currency: 'INR',
        receipt: `booking_${bookingId}`,
        notes: {
            bookingId,
            customerName: customerInfo.name || '',
            customerPhone: customerInfo.phone || ''
        }
    };

    try {
        const order = await razorpay.orders.create(options);
        logger.info({ data: order.id }, '✅ Razorpay order created:');
        return order;
    } catch (error) {
        logger.error({ data: error }, '❌ Razorpay order creation failed:');
        throw new Error('Failed to create payment order');
    }
};

/**
 * Verify payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 */
export const verifyPayment = (orderId: string, paymentId: string, signature: string) => {
    if (!razorpayInitialized) {
        logger.info('💳 [MOCK] Would verify payment');
        return true; // Mock verification always passes
    }

    try {
        const text = orderId + '|' + paymentId;
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
            .update(text)
            .digest('hex');

        const isValid = generated_signature === signature;

        if (isValid) {
            logger.info('✅ Payment signature verified');
        } else {
            logger.error('❌ Invalid payment signature');
        }

        return isValid;
    } catch (error) {
        logger.error({ data: error }, '❌ Payment verification error:');
        return false;
    }
};

/**
 * Fetch payment details
 * @param {string} paymentId - Razorpay payment ID
 */
export const fetchPayment = async (paymentId: string) => {
    if (!razorpayInitialized || !razorpay) {
        return {
            id: paymentId,
            status: 'captured',
            amount: 50000,
            method: 'upi'
        };
    }

    try {
        const payment = await razorpay.payments.fetch(paymentId);
        return payment;
    } catch (error) {
        logger.error({ data: error }, '❌ Failed to fetch payment:');
        throw error;
    }
};

/**
 * Create refund
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund (optional, full refund if not specified)
 */
export const createRefund = async (paymentId: string, amount: number | null = null) => {
    if (!razorpayInitialized || !razorpay) {
        logger.info({ data: paymentId }, '💳 [MOCK] Would create refund for payment:');
        return {
            id: 'rfnd_mock_' + Date.now(),
            payment_id: paymentId,
            amount: amount || 50000,
            status: 'processed'
        };
    }

    const options = amount ? { amount: amount * 100 } : {}; // Full refund if amount not specified

    try {
        const refund = await razorpay.payments.refund(paymentId, options);
        logger.info({ data: refund.id }, '✅ Refund created:');
        return refund;
    } catch (error) {
        logger.error({ data: error }, '❌ Refund failed:');
        throw error;
    }
};

/**
 * Calculate platform commission (15% for KULABOUR)
 * @param {number} amount - Total booking amount
 * @returns {object} { workerAmount, platformCommission }
 */
export const calculateCommission = (amount: number) => {
    const COMMISSION_RATE = 0.15; // 15%
    const platformCommission = Math.round(amount * COMMISSION_RATE);
    const workerAmount = amount - platformCommission;

    return {
        totalAmount: amount,
        workerAmount,
        platformCommission,
        commissionRate: COMMISSION_RATE
    };
};

/**
 * Get Razorpay key ID for frontend
 */
export const getKeyId = () => {
    return process.env.RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXX';
};

// Export Razorpay instance for advanced usage
export { razorpay };
export const isInitialized = () => razorpayInitialized;


