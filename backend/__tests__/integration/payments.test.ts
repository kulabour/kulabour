import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../../app';
import Booking from '../../models/Booking';
import { connect, closeDatabase, clearDatabase } from '../setup/testDb';
import { createUser } from '../factories/UserFactory';
import { createBooking } from '../factories/BookingFactory';

// Mock Razorpay and Analytics
jest.mock('../../utils/razorpay', () => ({
    getKeyId: jest.fn(() => 'rzp_test_key'),
    createOrder: jest.fn(() => Promise.resolve({
        id: 'order_test_123',
        amount: 50000,
        currency: 'INR'
    })),
    verifyPayment: jest.fn(() => true),
    calculateCommission: jest.fn((amount) => ({
        totalAmount: amount,
        workerAmount: amount * 0.85,
        platformCommission: amount * 0.15,
        commissionRate: 0.15
    })),
    createRefund: jest.fn(() => Promise.resolve({
        id: 'rfnd_test_123'
    }))
}));

jest.mock('../../utils/analytics', () => ({
    trackPaymentInitiated: jest.fn(),
    trackPaymentCompleted: jest.fn(),
    trackPaymentFailed: jest.fn()
}));

jest.mock('../../utils/notifications', () => ({
    sendPaymentReceived: jest.fn()
}));

beforeAll(async () => {
    await connect();
});

afterEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
});

afterAll(async () => {
    await closeDatabase();
});

const generateToken = (user: any) => {
    return jwt.sign(
        { id: user._id, userType: user.userType },
        process.env.JWT_SECRET || 'test_jwt_secret',
        { expiresIn: '1h' }
    );
};

describe('Payment Integration Tests', () => {
    describe('POST /api/payments/create-order', () => {
        it('should create an order for a valid booking', async () => {
            const user = await createUser({ userType: 'customer' });
            const token = generateToken(user);

            const booking = await createBooking({
                customerId: user._id.toString(),
                totalAmount: 500
            });

            const res = await request(app)
                .post('/api/payments/create-order')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    bookingId: booking._id,
                    amount: 500
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.order.id).toBe('order_test_123');
        });

        it('should fail if booking does not belong to user', async () => {
            const user = await createUser({ userType: 'customer' });
            const otherUser = await createUser({ userType: 'customer' });
            const token = generateToken(user);

            const booking = await createBooking({
                customerId: otherUser._id.toString(), // Belongs to someone else
                totalAmount: 500
            });

            const res = await request(app)
                .post('/api/payments/create-order')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    bookingId: booking._id,
                    amount: 500
                });

            expect(res.status).toBe(403);
        });
    });

    describe('POST /api/payments/verify', () => {
        it('should verify payment and update booking status', async () => {
            const user = await createUser({ userType: 'customer' });
            const token = generateToken(user);

            const booking = await createBooking({
                customerId: user._id.toString(),
                totalAmount: 500,
                status: 'pending'
            });

            const res = await request(app)
                .post('/api/payments/verify')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    orderId: 'order_test_123',
                    paymentId: 'pay_test_123',
                    signature: "valid_signature",
                    bookingId: booking._id
                });

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            // Check DB update
            const updatedBooking = await Booking.findById(booking._id);
            expect(updatedBooking?.status).toBe('completed');
            expect(updatedBooking?.payment?.status).toBe('paid');
        });
    });
});
