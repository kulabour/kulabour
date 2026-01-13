// Mock Payment Service
// Simulates Razorpay/UPI payment flow

interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export const mockPaymentService = {
    initiatePayment: async (_amount: number, _method: string): Promise<PaymentResult> => {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                const isSuccess = Math.random() > 0.1; // 90% success rate

                if (isSuccess) {
                    resolve({
                        success: true,
                        transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Payment failed. Please try again.',
                    });
                }
            }, 2000);
        });
    },

    validateUPI: async (vpa: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(vpa.includes('@'));
            }, 500);
        });
    }
};
