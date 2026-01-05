import { UsersService } from '../users/users.service';
export declare class PushNotificationService {
    private usersService;
    private isInitialized;
    constructor(usersService: UsersService);
    private initialize;
    sendToUser(fcmToken: string, notification: {
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<boolean>;
    sendToMultiple(fcmTokens: string[], notification: {
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<number>;
    notifyWorkerOfNewBooking(workerId: string, booking: any): Promise<void>;
    notifyCustomerWorkerAssigned(customerId: string, worker: any): Promise<void>;
    notifyCustomerBookingComplete(customerId: string, booking: any): Promise<void>;
}
