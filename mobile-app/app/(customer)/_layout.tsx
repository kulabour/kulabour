import { Stack } from 'expo-router';
import { View } from 'react-native';
import { VoiceFab } from '../../components/VoiceFab';

export default function CustomerLayout() {
    return (
        <View style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="index" />
                <Stack.Screen name="home" />
                <Stack.Screen name="booking" />
                <Stack.Screen name="visual-booking" />
                <Stack.Screen
                    name="voice-assistant"
                    options={{
                        presentation: 'modal',
                        animation: 'slide_from_bottom',
                    }}
                />
            </Stack>
            <VoiceFab userType="customer" />
        </View>
    );
}
