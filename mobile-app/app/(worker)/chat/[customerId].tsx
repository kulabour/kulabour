import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Design System
import { Box } from '../../../components/primitives/Box';
import { Text } from '../../../components/primitives/Text';
import Avatar from '../../../components/ui/Avatar';
import { ChatBubble } from '../../../components/design-system/ChatBubble';
import { ChatInput } from '../../../components/design-system/ChatInput';

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
        <Box className="flex-1 bg-surface-base">
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    {/* Header */}
                    <Box className="px-md py-sm bg-brand-primary border-b border-white/10 flex-row items-center shadow-md z-10">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 items-center justify-center mr-xs"
                            accessibilityLabel="Go back"
                            accessibilityRole="button"
                        >
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <Avatar name="Rajesh Mehta" size="sm" online />

                        <Box className="ml-sm flex-1">
                            <Text variant="h3" className="text-white font-bold">Rajesh Mehta</Text>
                            <Text variant="caption" className="text-feedback-success font-bold">Online</Text>
                        </Box>

                        <TouchableOpacity
                            className="w-10 h-10 bg-white/10 rounded-full items-center justify-center"
                            accessibilityLabel="Call Customer"
                            accessibilityRole="button"
                        >
                            <Ionicons name="call" size={20} color="white" />
                        </TouchableOpacity>
                    </Box>

                    {/* Messages */}
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <ChatBubble
                                message={item.message}
                                isSent={item.isSent}
                                timestamp={item.timestamp}
                            />
                        )}
                        contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'flex-end' }}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Input */}
                    <ChatInput onSend={handleSend} placeholder="Message Rajesh..." />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Box>
    );
}
