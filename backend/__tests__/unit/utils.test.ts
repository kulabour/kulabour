import {
    isValidEmail,
    isValidIndianPhone,
    sanitizeString,
    maskSensitiveData,
    generateSecureToken
} from '../../utils/security';
import { sendToDevice } from '../../utils/notifications';
import { admin } from '../../utils/notifications';

// Mock Firebase Admin
jest.mock('../../utils/notifications', () => {
    const originalModule = jest.requireActual('../../utils/notifications');
    return {
        ...originalModule,
        admin: {
            messaging: jest.fn().mockReturnValue({
                send: jest.fn().mockResolvedValue('mock-message-id')
            })
        },
        // We also need to mock the exported boolean or just set the prop if possible. 
        // But since isInitialized is exported, we might need to mock that too to force true.
        // Actually, sendToDevice checks the local variable `firebaseInitialized`. 
        // To test it, we might need to bypass that check or mock the variable if it was exported.
        // Since it's not exported, we can't easily change it from outside. 
        // However, we can mock the entire `sendToDevice` function to test *callers* of it, 
        // OR we just test `security.ts` mostly and maybe `notifications` if we can enable initialization.
        // For now, let's focus on `security.ts` which is pure logic.
    };
});

describe('Utils Unit Tests', () => {
    describe('Security Utils', () => {
        it('should validate emails', () => {
            expect(isValidEmail('test@example.com')).toBe(true);
            expect(isValidEmail('invalid-email')).toBe(false);
        });

        it('should validate Indian phone numbers', () => {
            expect(isValidIndianPhone('9876543210')).toBe(true);
            expect(isValidIndianPhone('+919876543210')).toBe(true);
            expect(isValidIndianPhone('1234567890')).toBe(false);
        });

        it('should sanitize strings', () => {
            expect(sanitizeString('<script>alert(1)</script>')).toBe('alert(1)');
            expect(sanitizeString('  hello  ')).toBe('hello');
        });

        it('should mask sensitive data', () => {
            const data = { password: 'secret', email: 'test@test.com', nested: { token: 'abc' } };
            // Note: Current implementation is shallow or keys check. Let's check implementation.
            // utils/security.ts:128 uses shallow copy and iterate keys.
            const masked = maskSensitiveData(data);
            expect(masked.password).toBe('***MASKED***');
            expect(masked.email).toBe('test@test.com');
        });

        it('should generate secure tokens', () => {
            const token = generateSecureToken(16);
            expect(token).toHaveLength(32); // hex string is double length
        });
    });
});
