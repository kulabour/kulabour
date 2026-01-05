const { calculateCommission } = require('../../utils/razorpay');

describe('Razorpay Utils', () => {
    describe('calculateCommission', () => {
        it('should calculate 15% commission correctly', () => {
            const amount = 1000;
            const result = calculateCommission(amount);

            expect(result).toEqual({
                totalAmount: 1000,
                workerAmount: 850,
                platformCommission: 150,
                commissionRate: 0.15
            });
        });

        it('should handle decimal amounts correctly', () => {
            const amount = 100.50;
            const result = calculateCommission(amount);

            // 15% of 100.50 is 15.075, rounded is 15
            // worker amount is 100.50 - 15 = 85.50
            expect(result.platformCommission).toBe(15);
            expect(result.workerAmount).toBe(85.5);
        });

        it('should handle zero amount', () => {
            const result = calculateCommission(0);
            expect(result).toEqual({
                totalAmount: 0,
                workerAmount: 0,
                platformCommission: 0,
                commissionRate: 0.15
            });
        });
    });
});
