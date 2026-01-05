import request from 'supertest';
import app from '../../app';
import { connect, closeDatabase, clearDatabase } from '../setup/testDb';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../../models/User';

// Mock dependencies
jest.mock('../../utils/notifications');
jest.mock('../../utils/razorpay');

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

// Helper to create authenticated user and get token
const createTestUser = async (role: 'customer' | 'worker') => {
    const user = await User.create({
        mobile: role === 'customer' ? '9876543210' : '9988776655',
        userType: role,
        name: `${role} User`,
        profile: { name: `${role} User` }
    });

    const token = jwt.sign(
        { userId: user._id, mobile: user.mobile, role: user.userType },
        process.env.JWT_SECRET || 'test_jwt_secret',
        { expiresIn: '1h' }
    );

    return { user, token };
};

describe('Booking Integration Tests', () => {
    let customerToken: string;
    let workerToken: string;
    let customerId: string;
    let workerId: string;

    beforeEach(async () => {
        const customer = await createTestUser('customer');
        customerToken = customer.token;
        customerId = customer.user._id.toString();

        const worker = await createTestUser('worker');
        workerToken = worker.token;
        workerId = worker.user._id.toString();
    });

    describe('POST /api/bookings', () => {
        it('should create a booking successfully', async () => {
            const bookingData = {
                serviceId: '1',
                serviceName: 'Cleaning',
                customerId: customerId,
                customerName: 'Test Customer',
                address: '123 Test St',
                scheduledTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
                totalAmount: 500
            };

            const res = await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${customerToken}`)
                .send(bookingData);

            expect(res.status).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.status).toBe('pending');
        });

        it('should fail if unauthenticated', async () => {
            const res = await request(app)
                .post('/api/bookings')
                .send({});

            expect(res.status).toBe(401);
        });
    });

    describe('GET /api/bookings', () => {
        it('should list bookings for customer', async () => {
            // Create a booking first (bypass API to save time or use API)
            // Using API to test flow
            await request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    serviceId: '1',
                    serviceName: 'Cleaning',
                    customerId: customerId,
                    customerName: 'Test Customer',
                    address: '123 Test St',
                    scheduledTime: new Date(Date.now() + 86400000).toISOString(),
                    totalAmount: 500
                });

            const res = await request(app)
                .get('/api/bookings')
                .set('Authorization', `Bearer ${customerToken}`);

            expect(res.status).toBe(200);
            expect(res.body.data).toHaveLength(1);
        });
    });
});
