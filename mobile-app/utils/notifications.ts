import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/client';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Register for push notifications
 * Call this on app launch after user logs in
 */
export async function registerForPushNotifications() {
    let token;

    if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return null;
    }

    // Check existing permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not granted
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.warn('Permission for push notifications denied');
        return null;
    }

    // Get Expo push token
    try {
        token = (await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig?.extra?.eas?.projectId || 'your-project-id'
        })).data;

        console.log('✅ Push token:', token);
    } catch (error) {
        console.error('Error getting push token:', error);
        return null;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('kulabour_bookings', {
            name: 'Bookings & Updates',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#0078D4',
            sound: 'default',
            enableVibrate: true,
            showBadge: true,
        });

        await Notifications.setNotificationChannelAsync('kulabour_chat', {
            name: 'Chat Messages',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 100, 100],
            lightColor: '#00E676',
            sound: 'default',
        });
    }

    // Save token locally
    if (token) {
        await AsyncStorage.setItem('fcmToken', token);

        // Send to backend
        try {
            await api.post('/users/fcm-token', { token });
            console.log('✅ Token sent to server');
        } catch (error) {
            console.error('Failed to send token to server:', error);
        }
    }

    return token;
}

/**
 * Setup notification listeners
 * Call this in your root layout (_layout.tsx)
 */
export function setupNotificationListeners() {
    // Notification received while app is in foreground
    const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
        console.log('📥 Notification received:', notification);

        // You can show custom UI here instead of system notification
        const { title, body } = notification.request.content;
        const data = notification.request.content.data as any;

        // Optional: Show in-app alert
        // Alert.alert(title, body);
    });

    // Notification tapped (user clicked on it)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data as any;

        console.log('👆 Notification tapped:', data);

        // Navigate based on notification type
        if (data.type === 'BOOKING_CREATED' || data.type === 'STATUS_UPDATE') {
            router.push(`/(customer)/bookings/${data.bookingId}`);
        } else if (data.type === 'WORKER_ASSIGNED') {
            router.push(`/(customer)/tracking/${data.bookingId}`);
        } else if (data.type === 'CHAT_MESSAGE') {
            router.push(`/(customer)/chat/${data.bookingId}`);
        } else if (data.type === 'PAYMENT_RECEIVED') {
            router.push(`/(worker)/earnings`);
        }
    });

    // Return cleanup function
    return () => {
        receivedSubscription.remove();
        responseSubscription.remove();
    };
}

/**
 * Send a test local notification
 */
export async function sendTestNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'KULABOUR Test',
            body: 'Push notifications are working! 🎉',
            data: { type: 'TEST' },
        },
        trigger: null, // Send immediately
    });
}

/**
 * Schedule a reminder notification
 */
export async function scheduleBookingReminder(bookingId: string, scheduledTime: Date) {
    const reminderTime = new Date(scheduledTime.getTime() - 30 * 60 * 1000); // 30 min before

    await Notifications.scheduleNotificationAsync({
        content: {
            title: '⏰ Booking Reminder',
            body: 'आपकी booking 30 मिनट में है',
            data: {
                type: 'BOOKING_REMINDER',
                bookingId
            },
        },
        trigger: {
            type: 'date',
            date: reminderTime,
        } as any,
    });
}

/**
 * Cancel all pending notifications
 */
export async function cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Get notification permissions status
 */
export async function getNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
}
