import { Platform } from 'react-native';
// NOTE: expo-firebase-analytics package doesn't exist in current dependencies
// TODO: Install proper analytics package (firebase-analytics or expo-analytics)
// import * as Analytics from 'expo-firebase-analytics';

class AnalyticsService {
    private enabled: boolean = false;

    async initialize() {
        try {
            // Only enable on production
            if (process.env.NODE_ENV === 'production' && Platform.OS !== 'web') {
                this.enabled = false; // Disabled until analytics package installed
                console.log('📊 Analytics disabled - no package installed');
            } else {
                console.log('📊 Analytics disabled in development');
            }
        } catch (error) {
            console.error('Analytics initialization failed:', error);
        }
    }

    async logEvent(name: string, params?: Record<string, any>) {
        if (!this.enabled) return;

        try {
            // await Analytics.logEvent(name, params);
            console.log('[Analytics]', name, params);
        } catch (error) {
            console.error('Analytics event failed:', error);
        }
    }

    async logScreenView(screenName: string, screenClass?: string) {
        if (!this.enabled) return;

        try {
            // await Analytics.setCurrentScreen(screenName, screenClass);
            console.log('[Analytics] Screen:', screenName);
        } catch (error) {
            console.error('Analytics screen view failed:', error);
        }
    }

    async setUserId(userId: string) {
        if (!this.enabled) return;

        try {
            // await Analytics.setUserId(userId);
            console.log('[Analytics] User ID:', userId);
        } catch (error) {
            console.error('Analytics set user ID failed:', error);
        }
    }

    async setUserProperty(name: string, value: string) {
        if (!this.enabled) return;

        try {
            // await Analytics.setUserProperty(name, value);
            console.log('[Analytics] User property:', name, value);
        } catch (error) {
            console.error('Analytics set user property failed:', error);
        }
    }

    // Predefined events
    async logSignUp(method: string) {
        await this.logEvent('sign_up', { method });
    }

    async logLogin(method: string) {
        await this.logEvent('login', { method });
    }

    async logBookingCreated(serviceType: string, amount: number) {
        await this.logEvent('booking_created', {
            service_type: serviceType,
            value: amount,
            currency: 'INR',
        });
    }

    async logBookingCompleted(serviceType: string, amount: number) {
        await this.logEvent('booking_completed', {
            service_type: serviceType,
            value: amount,
            currency: 'INR',
        });
    }

    async logSearch(searchTerm: string) {
        await this.logEvent('search', { search_term: searchTerm });
    }
}

export const analyticsService = new AnalyticsService();
