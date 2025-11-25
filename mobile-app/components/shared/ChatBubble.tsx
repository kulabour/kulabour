import { View, Text } from 'react-native';

interface ChatBubbleProps {
    message: string;
    isSent: boolean;
    timestamp: string;
    avatar?: string;
}

export default function ChatBubble({
    message,
    isSent,
    timestamp,
    avatar,
}: ChatBubbleProps) {
    return (
        <View
            className={`mb-4 flex-row ${isSent ? 'justify-end' : 'justify-start'}`}
        >
            <View className={`max-w-[75%] ${isSent ? 'items-end' : 'items-start'}`}>
                <View
                    className={`px-4 py-3 rounded-2xl ${isSent
                            ? 'bg-neon-blue rounded-br-sm'
                            : 'bg-dark-charcoal border border-white/10 rounded-bl-sm'
                        }`}
                >
                    <Text className="text-white text-base leading-5">{message}</Text>
                </View>
                <Text className="text-white/40 text-xs mt-1 px-1">{timestamp}</Text>
            </View>
        </View>
    );
}
