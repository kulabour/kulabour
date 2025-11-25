import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function KYCScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-2">Identity Check</Text>
                <Text className="text-gray-500 mb-8">Upload your Aadhaar card</Text>

                <View className="gap-6">
                    <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center bg-gray-50 active:bg-blue-50 active:border-primary">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-3">
                            <Text className="text-2xl">📷</Text>
                        </View>
                        <Text className="font-medium text-gray-900">Front of Aadhaar</Text>
                        <Text className="text-xs text-gray-500 mt-1">Tap to take photo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-xl p-8 items-center bg-gray-50 active:bg-blue-50 active:border-primary">
                        <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mb-3">
                            <Text className="text-2xl">📷</Text>
                        </View>
                        <Text className="font-medium text-gray-900">Back of Aadhaar</Text>
                        <Text className="text-xs text-gray-500 mt-1">Tap to take photo</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Link href="/(worker)/onboarding/face-auth" asChild>
                <TouchableOpacity className="bg-primary p-4 rounded-xl items-center">
                    <Text className="text-white font-bold text-base">Next Step</Text>
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}
