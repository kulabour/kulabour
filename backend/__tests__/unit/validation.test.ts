import {
    createBookingSchema,
    updateBookingSchema,
    registerUserSchema,
    createServiceSchema,
    createReviewSchema
} from '../../validation/schemas';

describe('Validation Schemas Unit Tests', () => {

    describe('Booking Schemas', () => {
        it('should validate correct booking data', () => {
            const validData = {
                serviceId: '507f1f77bcf86cd799439011',
                serviceName: 'Plumbing',
                date: '2025-12-25',
                time: '10:00',
                address: {
                    street: '123 Main St',
                    city: 'Metropolis',
                    zip: '12345',
                    coordinates: [72.8, 19.1]
                },
                totalAmount: 500
            };
            const { error } = createBookingSchema.validate(validData);
            expect(error).toBeUndefined();
        });

        it('should require serviceId', () => {
            const invalidData = {
                serviceName: 'Plumbing',
                // Missing serviceId
                date: '2025-12-25',
                time: '10:00',
                address: { street: '123' },
                totalAmount: 500
            };
            const { error } = createBookingSchema.validate(invalidData);
            expect(error).toBeDefined();
            expect(error?.details[0].message).toContain('serviceId');
        });
    });

    describe('User Registration Schema', () => {
        it('should validate correct user data', () => {
            const validData = {
                mobile: '9876543210',
                userType: 'customer',
                name: 'Test User'
            };
            const { error } = registerUserSchema.validate(validData);
            expect(error).toBeUndefined();
        });

        it('should reject invalid mobile number', () => {
            const invalidData = {
                mobile: '123', // Too short
                userType: 'customer'
            };
            const { error } = registerUserSchema.validate(invalidData);
            expect(error).toBeDefined();
        });
    });

    describe('Service Schema', () => {
        it('should validate correct service data', () => {
            const validData = {
                name: 'AC Repair',
                category: 'Appliance',
                price: 500,
                description: 'Fix AC',
                duration: 60
            };
            const { error } = createServiceSchema.validate(validData);
            expect(error).toBeUndefined();
        });
    });
});
