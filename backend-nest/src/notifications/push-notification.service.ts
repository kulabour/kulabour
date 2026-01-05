import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { UsersService } from '../users/users.service';

@Injectable()
export class PushNotificationService {
    private isInitialized = false;

    constructor(private usersService: UsersService) {
        this.initialize();
    }

    private initialize() {
        if (this.isInitialized) return;

        // MOCK MODE: Skip Firebase init
        if (process.env.USE_MOCKS === 'true') {
            console.log('⚠️  Mock Mode: Push Notifications will be logged to console only.');
            return;
        }

        try {
            // Initialize Firebase Admin SDK
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                });
                this.isInitialized = true;
                console.log('✅ Firebase Admin SDK initialized');
            } else {
                console.warn('⚠️  Firebase credentials not found. Push notifications disabled.');
            }
        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
        }
    }

    async sendToUser(
        fcmToken: string,
        notification: {
            title: string;
            body: string;
            data?: Record<string, string>;
        }
    ): Promise<boolean> {
        // MOCK MODE: Just log and return success
        if (process.env.USE_MOCKS === 'true') {
            console.log(`[MOCK NOTIFICATION] To: ${fcmToken.substring(0, 10)}... | Title: ${notification.title}`);
            return true;
        }

        if (!this.isInitialized) {
            console.warn('Push notification skipped: Firebase not initialized');
            return false;
        }

        try {
            const message: admin.messaging.Message = {
                token: fcmToken,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            badge: 1,
                        },
                    },
                },
            };

            const response = await admin.messaging().send(message);
            console.log(`✅ Push notification sent: ${response}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to send push notification:', error);
            return false;
        }
    }

    async sendToMultiple(
        fcmTokens: string[],
        notification: {
            title: string;
            body: string;
            data?: Record<string, string>;
        }
    ): Promise<number> {
        // MOCK MODE
        if (process.env.USE_MOCKS === 'true') {
            console.log(`[MOCK BATCH NOTIFICATION] To: ${fcmTokens.length} users | Title: ${notification.title}`);
            return fcmTokens.length;
        }

        if (!this.isInitialized || fcmTokens.length === 0) {
            return 0;
        }

        try {
            const message: admin.messaging.MulticastMessage = {
                tokens: fcmTokens,
                notification: {
                    title: notification.title,
                    body: notification.body,
                },
                data: notification.data || {},
                android: { priority: 'high' },
            };

            const response = await admin.messaging().sendEachForMulticast(message);
            console.log(`✅ Sent ${response.successCount}/${fcmTokens.length} notifications`);
            return response.successCount;
        } catch (error) {
            console.error('❌ Failed to send batch notifications:', error);
            return 0;
        }
    }

    // Specific notification methods

    async notifyWorkerOfNewBooking(workerId: string, booking: any) {
        if (process.env.USE_MOCKS === 'true') {
            console.log(`📢 [MOCK] Notify Worker ${workerId}: New Booking ${booking._id}`);
            return;
        }

        const worker = await this.usersService.findById(workerId);
        if (worker && worker.fcmToken) {
            await this.sendToUser(worker.fcmToken, {
                title: 'New Booking Request! 🚨',
                body: `New job near you: ${booking.serviceName || 'Service'}. Tap to accept!`,
                data: { bookingId: booking._id.toString(), type: 'NEW_BOOKING' }
            });
        }
    }

    async notifyCustomerWorkerAssigned(customerId: string, worker: any) {
        if (process.env.USE_MOCKS === 'true') {
            console.log(`📢 [MOCK] Notify Customer ${customerId}: Worker ${worker.name} Assigned`);
            return;
        }

        const customer = await this.usersService.findById(customerId);
        if (customer && customer.fcmToken) {
            await this.sendToUser(customer.fcmToken, {
                title: 'Worker Assigned! 👷',
                body: `${worker.name} has accepted your request and is on the way.`,
                data: { workerId: worker._id.toString(), type: 'WORKER_ASSIGNED' }
            });
        }
    }

    async notifyCustomerBookingComplete(customerId: string, booking: any) {
        if (process.env.USE_MOCKS === 'true') {
            console.log(`📢 [MOCK] Notify Customer ${customerId}: Booking ${booking._id} Complete`);
            return;
        }

        const customer = await this.usersService.findById(customerId);
        if (customer && customer.fcmToken) {
            await this.sendToUser(customer.fcmToken, {
                title: 'Job Completed! ✅',
                body: 'Your service has been completed. Please rate your worker.',
                data: { bookingId: booking._id.toString(), type: 'BOOKING_COMPLETE' }
            });
        }
    }
}
