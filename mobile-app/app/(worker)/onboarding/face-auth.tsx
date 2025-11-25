import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FaceAuthScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <View className="flex-1 items-center justify-center">
                <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">Face Verification</Text>
                <Text className="text-gray-500 mb-8 text-center">We need to verify it's really you</Text>

                {/* Camera Simulation */}
                <View className="w-64 h-64 bg-gray-900 rounded-full overflow-hidden border-4 border-primary mb-8 relative">
                    <View className="absolute inset-0 items-center justify-center">
                        <Text className="text-white/50">Camera Feed</Text>
                    </View>
                    {/* Scanning Overlay */}
                    <View className="absolute inset-0 border-4 border-green-400 rounded-full opacity-50" />
                </View>

                <View className="items-center gap-2">
                    <Text className="font-bold text-lg">Look straight ahead</Text>
                    <Text className="text-sm text-gray-500">Keep your face within the circle</Text>
                </View>
            </View>

            <Link href="/(worker)/onboarding/skills" asChild>
                <TouchableOpacity className="bg-primary p-4 rounded-xl items-center">
                    <Text className="text-white font-bold text-base">Capture & Verify</Text>
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}
