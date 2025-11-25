import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import ChatBubble from '../../../components/shared/ChatBubble';
import ChatInput from '../../../components/shared/ChatInput';
import Avatar from '../../../components/ui/Avatar';
import '../../../global.css';

const initialMessages = [
    {
        id: 1,
        message: 'Hello! I\'m on my way to your location.',
        isSent: true,
        timestamp: '2:15 PM',
    },
    {
        id: 2,
        message: 'Great! How long will it take?',
        isSent: false,
        timestamp: '2:16 PM',
    },
    {
        id: 3,
        message: 'I\'ll be there in about 10 minutes.',
        isSent: true,
        timestamp: '2:16 PM',
    },
    {
        id: 4,
        message: 'Perfect. I\'ll be waiting at the main gate.',
        isSent: false,
        timestamp: '2:17 PM',
    },
];

export default function WorkerChat() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [messages, setMessages] = useState(initialMessages);

    const handleSend = (message: string) => {
        const newMessage = {
            id: messages.length + 1,
            message,
            isSent: true,
            timestamp: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View className="px-6 py-4 bg-dark-charcoal border-b border-white/10 flex-row items-center">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center mr-3"
                    >
                        <Text className="text-white text-2xl">←</Text>
                    </TouchableOpacity>
                    <Avatar name="Rajesh Mehta" size="sm" online />
                    <View className="ml-3 flex-1">
                        <Text className="text-white font-bold text-lg">Rajesh Mehta</Text>
                        <Text className="text-success text-xs">Online</Text>
                    </View>
                    <TouchableOpacity className="w-10 h-10 bg-neon-blue/20 rounded-full items-center justify-center">
                        <Text className="text-xl">📞</Text>
                    </TouchableOpacity>
                </View>

                {/* Messages */}
                <ScrollView className="flex-1 px-6 py-4" showsVerticalScrollIndicator={false}>
                    {messages.map((msg) => (
                        <ChatBubble
                            key={msg.id}
                            message={msg.message}
                            isSent={msg.isSent}
                            timestamp={msg.timestamp}
                        />
                    ))}
                </ScrollView>

                {/* Input */}
                <ChatInput onSend={handleSend} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
