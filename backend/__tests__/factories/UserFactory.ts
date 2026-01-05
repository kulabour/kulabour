import User, { IUser } from '../../models/User';

export const createUser = async (overrides: Partial<IUser> = {}): Promise<IUser> => {
    const uniqueId = Math.random().toString(36).substring(7);
    const defaultUser = {
        name: `Test User ${uniqueId}`,
        mobile: `1234567${Math.floor(Math.random() * 1000)}`,
        userType: 'customer',
        email: `test${uniqueId}@example.com`,
        isVerified: false,
        verificationStatus: 'not_submitted',
    };

    const user = new User({ ...defaultUser, ...overrides });
    return user.save();
};
