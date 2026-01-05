/**
 * KULABOUR - Notification Service
 * Push notification handling with expo-notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationPayload {
    title: string;
    body: string;
    data?: Record<string, any>;
}

class NotificationService {
    private expoPushToken: string | null = null;

    /**
     * Initialize notification service and request permissions
     */
    async initialize(): Promise<string | null> {
        if (!Device.isDevice) {
            console.log('Push notifications not supported in simulator');
            return null;
        }

        // Check existing permissions
        const { status: existingStatus } = await Notifications.getPermissionsAsync();

        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push notification permissions');
            return null;
        }

        // Get Expo push token
        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId;
            const token = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
            this.expoPushToken = token.data;
            console.log('Expo Push Token:', this.expoPushToken);
            return this.expoPushToken;
        } catch (error) {
            console.error('Failed to get push token:', error);
            return null;
        }
    }

    /**
     * Get the current push token
     */
    getToken(): string | null {
        return this.expoPushToken;
    }

    /**
     * Schedule a local notification
     */
    async scheduleLocal(
        notification: NotificationPayload,
        trigger?: Notifications.NotificationTriggerInput
    ): Promise<string> {
        return await Notifications.scheduleNotificationAsync({
            content: {
                title: notification.title,
                body: notification.body,
                data: notification.data || {},
                sound: 'default',
            },
            trigger: trigger || null, // null = immediate
        });
    }

    /**
     * Show immediate notification
     */
    async showNow(notification: NotificationPayload): Promise<string> {
        return this.scheduleLocal(notification, null);
    }

    /**
     * Schedule notification for later
     */
    async scheduleIn(notification: NotificationPayload, seconds: number): Promise<string> {
        const triggerDate = new Date(Date.now() + seconds * 1000);
        return this.scheduleLocal(notification, triggerDate as any);
    }

    /**
     * Cancel a scheduled notification
     */
    async cancel(notificationId: string): Promise<void> {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
    }

    /**
     * Cancel all notifications
     */
    async cancelAll(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }

    /**
     * Set badge count
     */
    async setBadge(count: number): Promise<void> {
        await Notifications.setBadgeCountAsync(count);
    }

    /**
     * Add notification received listener
     */
    addReceivedListener(
        callback: (notification: Notifications.Notification) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationReceivedListener(callback);
    }

    /**
     * Add notification response listener (when user taps notification)
     */
    addResponseListener(
        callback: (response: Notifications.NotificationResponse) => void
    ): Notifications.Subscription {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }

    /**
     * Pre-built notification templates
     */
    templates = {
        jobAccepted: (workerName: string, eta: string) => ({
            title: '🎉 Worker Assigned!',
            body: `${workerName} accepted your job. ETA: ${eta}`,
            data: { type: 'job_accepted' },
        }),

        workerArriving: (workerName: string, minutes: number) => ({
            title: '🚗 Worker Arriving Soon!',
            body: `${workerName} will arrive in ${minutes} minutes`,
            data: { type: 'worker_arriving' },
        }),

        jobCompleted: (serviceName: string) => ({
            title: '✅ Job Completed!',
            body: `Your ${serviceName} has been completed. Please rate your experience.`,
            data: { type: 'job_completed' },
        }),

        newJobAlert: (serviceName: string, distance: string) => ({
            title: '🔔 New Job Alert!',
            body: `${serviceName} - ${distance} away. Tap to accept.`,
            data: { type: 'new_job' },
        }),

        paymentReceived: (amount: number) => ({
            title: '💰 Payment Received!',
            body: `₹${amount} has been added to your wallet.`,
            data: { type: 'payment' },
        }),
    };
}

export const notificationService = new NotificationService();
export default NotificationService;
