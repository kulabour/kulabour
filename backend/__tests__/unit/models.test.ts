import mongoose from 'mongoose';
import User from '../../models/User';
import Booking from '../../models/Booking';
import { connect, closeDatabase, clearDatabase } from '../setup/testDb';
import { createUser } from '../factories/UserFactory';
import { createBooking } from '../factories/BookingFactory';

beforeAll(async () => {
    await connect();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

describe('User Model', () => {
    it('should create a user successfully', async () => {
        const userData = {
            name: 'John Doe',
            mobile: '1234567890',
            userType: 'customer',
            email: 'john@example.com'
        };
        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.mobile).toBe(userData.mobile);
        expect(savedUser.userType).toBe(userData.userType);
        expect(savedUser.isVerified).toBe(false); // Default value
    });

    it('should fail if required fields are missing', async () => {
        const user = new User({ name: 'Incomplete User' });
        await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should enforce unique mobile number', async () => {
        const userData = {
            name: 'User 1',
            mobile: '9999999999',
            userType: 'customer'
        };

        await new User(userData).save();

        const duplicateUser = new User({
            name: 'User 2',
            mobile: '9999999999',
            userType: 'worker'
        });

        await expect(duplicateUser.save()).rejects.toThrow(); // Should be a duplicate key error
    });
});

describe('Booking Model', () => {
    it('should create a booking successfully', async () => {
        const customer = await createUser();
        const bookingData = {
            serviceId: 1,
            serviceName: 'Plumbing',
            customerId: customer.id,
            customerName: customer.name,
            address: '456 Pipe Ln',
            scheduledTime: new Date(),
            totalAmount: 1000,
            status: 'pending'
        };

        const booking = new Booking(bookingData);
        const savedBooking = await booking.save();

        expect(savedBooking._id).toBeDefined();
        expect(savedBooking.status).toBe('pending');
        expect(savedBooking.customerId).toBe(customer.id);
    });

    it('should default status to pending', async () => {
        const booking = await createBooking({ status: undefined });
        expect(booking.status).toBe('pending');
    });

    it('should require a valid enum for status', async () => {
        // @ts-ignore - Testing invalid enum
        const booking = await createBooking();
        booking.status = 'invalid_status';

        await expect(booking.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });
});
