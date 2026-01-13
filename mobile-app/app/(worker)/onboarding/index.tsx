import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LanguageScreen() {
    const languages = [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
        { code: 'mr', name: 'Marathi', native: 'मराठी' },
        { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="p-6 flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-2">Select Language</Text>
                <Text className="text-gray-500 mb-8">Choose your preferred language</Text>

                <View className="flex-row flex-wrap gap-4">
                    {languages.map((lang) => (
                        <Link key={lang.code} href="/(worker)/onboarding/otp" asChild>
                            <TouchableOpacity className="w-[47%] bg-gray-50 p-6 rounded-xl border border-gray-200 items-center active:bg-blue-50 active:border-primary">
                                <Text className="text-xl font-bold text-gray-900 mb-1">{lang.native}</Text>
                                <Text className="text-gray-500 text-xs">{lang.name}</Text>
                            </TouchableOpacity>
                        </Link>
                    ))}
                </View>
            </View>

            <View className="p-6 border-t border-gray-100">
                <Text className="text-center text-gray-400 text-xs">KULABOUR Instant Worker App</Text>
            </View>
        </SafeAreaView>
    );
}
