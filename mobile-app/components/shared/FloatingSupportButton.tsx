import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

interface FloatingSupportButtonProps {
    route: string;
}

export default function FloatingSupportButton({ route }: FloatingSupportButtonProps) {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push(route as any)}
            className="absolute bottom-20 right-6 w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-teal rounded-full items-center justify-center shadow-glow-blue-lg animate-float"
            activeOpacity={0.8}
        >
            <Text className="text-3xl">🤖</Text>
            <Text className="text-white text-xs font-bold mt-1">Help</Text>
        </TouchableOpacity>
    );
}
