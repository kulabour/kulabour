import * as Sentry from '@sentry/react-native';
import { isDevice } from 'expo-device';

export const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: true,
});

export const initSentry = () => {
    Sentry.init({
        dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
        debug: __DEV__, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
        tracesSampleRate: 1.0, // Capture 100% of the transactions for performance monitoring.
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
        integrations: [
            navigationIntegration,
        ],
        enableNative: isDevice,
    });
};
