import { Slot } from 'expo-router';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import your global CSS file
import "../global.css";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <View className="flex-1 bg-gray-100">
                <StatusBar style="auto" />
                <Slot />
            </View>
        </SafeAreaProvider>
    );
}
