import Booking, { IBooking } from '../../models/Booking';
import { createUser } from './UserFactory';

export const createBooking = async (overrides: Partial<IBooking> = {}): Promise<IBooking> => {
    // Ensure we have a customer
    let customerId = overrides.customerId;
    let customerName = overrides.customerName;

    if (!customerId) {
        const customer = await createUser({ userType: 'customer' });
        customerId = customer._id.toString();
        customerName = customer.name;
    }

    const defaultBooking = {
        serviceId: 1,
        serviceName: 'Cleaning',
        customerId: customerId,
        customerName: customerName || 'Test Customer',
        address: '123 Test St',
        scheduledTime: new Date(),
        totalAmount: 500,
        status: 'pending',
        addOns: []
    };

    const booking = new Booking({ ...defaultBooking, ...overrides });
    return booking.save();
};
