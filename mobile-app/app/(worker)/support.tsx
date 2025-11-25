import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AIChatbot from '../../components/shared/AIChatbot';
import '../../global.css';

export default function WorkerSupport() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center border-b border-white/10">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center mr-4"
                >
                    <Text className="text-white text-2xl">←</Text>
                </TouchableOpacity>
                <View className="flex-1">
                    <Text className="text-white text-2xl font-bold">Support</Text>
                    <Text className="text-white/50 text-sm">AI-powered assistance</Text>
                </View>
            </View>

            {/* AI Chatbot */}
            <AIChatbot userType="worker" />
        </SafeAreaView>
    );
}
