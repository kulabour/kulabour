import { Stack } from 'expo-router';

export default function WorkerLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}
