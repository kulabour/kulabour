/**
 * Auth Layout for Worker and Customer signup routes
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="worker/signup" />
            <Stack.Screen name="worker/otp" />
            <Stack.Screen name="worker/details" />
            <Stack.Screen name="worker/documents" />
            <Stack.Screen name="worker/policies" />
            <Stack.Screen name="worker/skills" />
            <Stack.Screen name="worker/complete" />
            <Stack.Screen name="worker/login" />
            <Stack.Screen name="customer/signup" />
            <Stack.Screen name="customer/otp" />
            <Stack.Screen name="customer/policies" />
            <Stack.Screen name="customer/complete" />
        </Stack>
    );
}
