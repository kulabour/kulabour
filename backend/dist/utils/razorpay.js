"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInitialized = exports.razorpay = exports.getKeyId = exports.calculateCommission = exports.createRefund = exports.fetchPayment = exports.verifyPayment = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = __importDefault(require("./logger"));
// Initialize Razorpay (with placeholder - add your keys)
let razorpayInitialized = false;
let razorpay = null;
exports.razorpay = razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        exports.razorpay = razorpay = new razorpay_1.default({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        razorpayInitialized = true;
        logger_1.default.info('✅ Razorpay initialized');
    }
    else {
        logger_1.default.warn('⚠️  Razorpay not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
}
catch (error) {
    logger_1.default.warn({ data: error.message }, '⚠️  Razorpay initialization failed:');
}
/**
 * Create a Razorpay order for a booking
 * @param {number} amount - Amount in INR
 * @param {string} bookingId - Booking ID
 * @param {object} customerInfo - Customer details
 */
const createOrder = async (amount, bookingId, customerInfo = {}) => {
    if (!razorpayInitialized || !razorpay) {
        logger_1.default.info('💳 [MOCK] Would create Razorpay order for ₹' + amount);
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
        logger_1.default.info({ data: order.id }, '✅ Razorpay order created:');
        return order;
    }
    catch (error) {
        logger_1.default.error({ data: error }, '❌ Razorpay order creation failed:');
        throw new Error('Failed to create payment order');
    }
};
exports.createOrder = createOrder;
/**
 * Verify payment signature
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 */
const verifyPayment = (orderId, paymentId, signature) => {
    if (!razorpayInitialized) {
        logger_1.default.info('💳 [MOCK] Would verify payment');
        return true; // Mock verification always passes
    }
    try {
        const text = orderId + '|' + paymentId;
        const generated_signature = crypto_1.default
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(text)
            .digest('hex');
        const isValid = generated_signature === signature;
        if (isValid) {
            logger_1.default.info('✅ Payment signature verified');
        }
        else {
            logger_1.default.error('❌ Invalid payment signature');
        }
        return isValid;
    }
    catch (error) {
        logger_1.default.error({ data: error }, '❌ Payment verification error:');
        return false;
    }
};
exports.verifyPayment = verifyPayment;
/**
 * Fetch payment details
 * @param {string} paymentId - Razorpay payment ID
 */
const fetchPayment = async (paymentId) => {
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
    }
    catch (error) {
        logger_1.default.error({ data: error }, '❌ Failed to fetch payment:');
        throw error;
    }
};
exports.fetchPayment = fetchPayment;
/**
 * Create refund
 * @param {string} paymentId - Razorpay payment ID
 * @param {number} amount - Amount to refund (optional, full refund if not specified)
 */
const createRefund = async (paymentId, amount = null) => {
    if (!razorpayInitialized || !razorpay) {
        logger_1.default.info({ data: paymentId }, '💳 [MOCK] Would create refund for payment:');
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
        logger_1.default.info({ data: refund.id }, '✅ Refund created:');
        return refund;
    }
    catch (error) {
        logger_1.default.error({ data: error }, '❌ Refund failed:');
        throw error;
    }
};
exports.createRefund = createRefund;
/**
 * Calculate platform commission (15% for KULABOUR)
 * @param {number} amount - Total booking amount
 * @returns {object} { workerAmount, platformCommission }
 */
const calculateCommission = (amount) => {
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
exports.calculateCommission = calculateCommission;
/**
 * Get Razorpay key ID for frontend
 */
const getKeyId = () => {
    return process.env.RAZORPAY_KEY_ID || 'rzp_test_XXXXXXXXXX';
};
exports.getKeyId = getKeyId;
const isInitialized = () => razorpayInitialized;
exports.isInitialized = isInitialized;
