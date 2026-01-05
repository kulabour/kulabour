"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3001';
async function verifyPaymentFlow() {
    console.log('🚀 Starting Payment Verification...');
    try {
        const bookingId = '654321098765432109876543';
        console.log(`📝 Using Mock Booking ID: ${bookingId}`);
        console.log('💳 Initiating Payment Order...');
        const orderResponse = await axios_1.default.post(`${API_URL}/payment/create-order`, {
            bookingId,
            amount: 500
        });
        if (orderResponse.data && orderResponse.data.id) {
            console.log('✅ Order Created:', orderResponse.data.id);
        }
        else {
            console.error('❌ Failed to create order:', orderResponse.data);
            return;
        }
        const orderId = orderResponse.data.id;
        console.log('🔐 Verifying Payment Signature...');
        const paymentId = 'pay_mock_123456';
        const verifyResponse = await axios_1.default.post(`${API_URL}/payment/verify`, {
            orderId,
            paymentId,
            signature: 'mock_signature',
            bookingId
        });
        if (verifyResponse.data.success) {
            console.log('✅ Payment Verification Successful!');
        }
        else {
            console.error('❌ Payment Verification Failed:', verifyResponse.data);
        }
    }
    catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.error('❌ Connection refused! Is the NestJS backend running on port 3001?');
        }
        else {
            console.error('❌ Error:', error.response ? error.response.data : error.message);
        }
    }
}
verifyPaymentFlow();
//# sourceMappingURL=verify-payment.js.map