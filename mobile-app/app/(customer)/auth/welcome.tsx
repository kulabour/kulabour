import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '../../../components/ui/Button';
import '../../../global.css';

export default function Welcome() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-dark-navy justify-between px-6 py-10">
            <View className="items-center mt-10">
                {/* Placeholder for 3D Illustration */}
                <View className="w-64 h-64 bg-neon-blue/10 rounded-full items-center justify-center mb-8 border border-neon-blue/30 shadow-glow-blue">
                    <Text className="text-6xl">🛠️</Text>
                </View>

                <Text className="text-white text-4xl font-bold text-center mb-4">
                    Instant Labor
                    <Text className="text-neon-blue"> On Demand</Text>
                </Text>

                <Text className="text-white/60 text-lg text-center px-4">
                    Find skilled workers for your daily needs in minutes. Reliable, fast, and secure.
                </Text>
            </View>

            <View className="w-full space-y-4">
                <Button
                    variant="primary"
                    size="lg"
                    glow
                    fullWidth
                    onPress={() => router.push('/(customer)/auth/login')}
                >
                    Get Started
                </Button>

                <Button
                    variant="ghost"
                    size="lg"
                    fullWidth
                    onPress={() => router.push('/(worker)/auth/login')}
                >
                    I'm a Worker
                </Button>
            </View>
        </SafeAreaView>
    );
}
