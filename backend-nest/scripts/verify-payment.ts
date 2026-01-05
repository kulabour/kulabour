// scripts/verify-payment.ts
// Run with: npx ts-node scripts/verify-payment.ts

import axios from 'axios';

const API_URL = 'http://localhost:3001';

async function verifyPaymentFlow() {
    console.log('🚀 Starting Payment Verification...');

    try {
        // 1. Create a mock booking (simulated)
        // In a real E2E, we'd hit the create-booking endpoint first.
        // For this script, we'll assume a valid booking ID format.
        const bookingId = '654321098765432109876543'; // Mock Mongo ID
        console.log(`📝 Using Mock Booking ID: ${bookingId}`);

        // 2. Create Order
        console.log('💳 Initiating Payment Order...');
        const orderResponse = await axios.post(`${API_URL}/payment/create-order`, {
            bookingId,
            amount: 500
        });

        if (orderResponse.data && orderResponse.data.id) {
            console.log('✅ Order Created:', orderResponse.data.id);
        } else {
            console.error('❌ Failed to create order:', orderResponse.data);
            return;
        }

        const orderId = orderResponse.data.id;

        // 3. Verify Payment (Mock Signature)
        // Since we are mocking Razorpay in the backend service when keys aren't present,
        // we can simulate a successful verification.
        console.log('🔐 Verifying Payment Signature...');

        // Mock data matching what the frontend would send
        const paymentId = 'pay_mock_123456';
        // Note: The backend mock verification expects generated_signature !== signature to fail.
        // If keys are missing, the backend returns true immediately.
        // If keys ARE present, we need a valid signature. 
        // We'll pass a dummy verification payload.

        const verifyResponse = await axios.post(`${API_URL}/payment/verify`, {
            orderId,
            paymentId,
            signature: 'mock_signature', // Backend mock bypasses validation if no keys
            bookingId
        });

        if (verifyResponse.data.success) {
            console.log('✅ Payment Verification Successful!');
        } else {
            console.error('❌ Payment Verification Failed:', verifyResponse.data);
        }

    } catch (error: any) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Connection refused! Is the NestJS backend running on port 3001?');
        } else {
            console.error('❌ Error:', error.response ? error.response.data : error.message);
        }
    }
}

verifyPaymentFlow();
