import { Platform } from "react-native";

// In a real Expo app, use expo-constants or react-native-dotenv
// For now, we will use a centralized object that can be easily swapped or mocked

// Use your machine's LAN IP for real device testing
const LAN_API_URL = 'http://192.168.31.232:3000';
const DEV_API_URL = 'http://localhost:3000';
// Android emulator uses 10.0.2.2 for localhost
const ANDROID_API_URL = 'http://10.0.2.2:3000';

const getBaseUrl = () => {
    if (__DEV__) {
        // Return LAN URL by default for better real-device support
        // You can change this to ANDROID_API_URL if exclusively using emulator
        if (Platform.OS === 'android') return ANDROID_API_URL;
        return LAN_API_URL;
    }
    // Production URL (Placeholder)
    return 'https://api.kulabour.com';
};

export const Config = {
    API_URL: getBaseUrl(),
    SOCKET_URL: getBaseUrl() + '/chat',
    TRACKING_SOCKET_URL: getBaseUrl() + '/live-tracking',
    GOOGLE_MAPS_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    FEATURES: {
        USE_MOCK_DATA: false, // Set to false to test real integration
    }
} as const;
