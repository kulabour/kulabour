import request from 'supertest';
import app from '../../app';
import { connect, closeDatabase, clearDatabase } from '../setup/testDb';

// Mock dependencies to avoid external calls
jest.mock('../../utils/notifications');
jest.mock('../../utils/razorpay');

// Use beforeAll/afterAll for DB connection
beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('Auth Integration Tests', () => {

    describe('POST /api/auth/send-otp', () => {
        it('should send OTP for valid mobile number', async () => {
            const res = await request(app)
                .post('/api/auth/send-otp')
                .send({ mobile: '9876543210' }); // Assuming 10 digit check

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toContain('OTP sent');
            // Check debug details if enabled
            if (res.body.debug) {
                expect(res.body.debug.otp).toHaveLength(4);
            }
        });

        it('should fail for invalid mobile number', async () => {
            const res = await request(app)
                .post('/api/auth/send-otp')
                .send({ mobile: '123' });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/verify-otp', () => {
        it('should verify OTP and return tokens', async () => {
            // 1. Send OTP
            const sendRes = await request(app)
                .post('/api/auth/send-otp')
                .send({ mobile: '9988776655' });

            const otp = sendRes.body.debug.otp;

            // 2. Verify OTP
            const verifyRes = await request(app)
                .post('/api/auth/verify-otp')
                .send({
                    mobile: '9988776655',
                    otp,
                    userType: 'customer'
                });

            expect(verifyRes.status).toBe(200);
            expect(verifyRes.body.success).toBe(true);
            expect(verifyRes.body.data.accessToken).toBeDefined();
            expect(verifyRes.body.data.refreshToken).toBeDefined();
            expect(verifyRes.body.data.user.mobile).toBe('9988776655');
        });

        it('should fail for invalid OTP', async () => {
            // 1. Send OTP
            await request(app)
                .post('/api/auth/send-otp')
                .send({ mobile: '9988776655' });

            // 2. Verify Invalid OTP
            const verifyRes = await request(app)
                .post('/api/auth/verify-otp')
                .send({
                    mobile: '9988776655',
                    otp: '0000',
                    userType: 'customer'
                });

            expect(verifyRes.status).toBe(400);
        });
    });
});
