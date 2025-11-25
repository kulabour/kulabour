import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OTPScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-2">Login</Text>
                <Text className="text-gray-500 mb-8">Enter your mobile number to continue</Text>

                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">Mobile Number</Text>
                    <View className="flex-row gap-3">
                        <View className="bg-gray-50 border border-gray-300 rounded-lg px-4 justify-center">
                            <Text className="font-medium text-gray-600">+91</Text>
                        </View>
                        <TextInput
                            placeholder="98765 43210"
                            keyboardType="phone-pad"
                            className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-lg"
                        />
                    </View>
                </View>

                <TouchableOpacity className="bg-primary p-4 rounded-xl items-center mb-8">
                    <Text className="text-white font-bold text-base">Get OTP</Text>
                </TouchableOpacity>

                <View className="border-t border-gray-100 pt-8">
                    <Text className="text-gray-500 mb-4 text-sm">Enter OTP sent to +91 98765 43210</Text>
                    <View className="flex-row justify-between mb-8 gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <TextInput
                                key={i}
                                className="w-14 h-14 border border-gray-300 rounded-lg text-center text-xl font-bold bg-gray-50"
                                maxLength={1}
                                keyboardType="number-pad"
                            />
                        ))}
                    </View>

                    <Link href="/(worker)/onboarding/kyc" asChild>
                        <TouchableOpacity className="bg-primary p-4 rounded-xl items-center">
                            <Text className="text-white font-bold text-base">Verify & Continue</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </SafeAreaView>
    );
}
