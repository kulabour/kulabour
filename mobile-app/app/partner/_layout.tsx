/**
 * KULABOUR Partner App Layout
 * Navigation structure for worker/partner app
 */

import { Stack } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { VoiceFab } from '../../components/VoiceFab';

export default function PartnerLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="index" />
                <Stack.Screen name="jobs" />
                <Stack.Screen name="earnings" />
                <Stack.Screen name="profile" />
                <Stack.Screen name="help" />
            </Stack>
            <VoiceFab userType="worker" />
        </View>
    );
}
