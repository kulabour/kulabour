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
import { chatService, ChatMessage } from '../../../services/ChatService';

import { useAuth } from '../../../context/AuthContext';
import '../../../global.css';

export default function ChatScreen() {
    const { id: workerId } = useLocalSearchParams();
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    // Auth Context
    const { user, token } = useAuth();
    const currentUserId = user?.id || 'anonymous';

    // Create a unique room ID sorted by user IDs to ensure consistency
    // room_ID1_ID2 (where ID1 < ID2)
    const sortedIds = [currentUserId, workerId as string].sort();
    const roomId = `room_${sortedIds[0]}_${sortedIds[1]}`;

    useEffect(() => {
        if (!token || !user) return;

        chatService.connect(token);
        chatService.joinRoom(roomId);

        const handleReceiveMessage = (payload: ChatMessage) => {
            setMessages(prev => [...prev, payload]);
        };

        const handleTyping = (payload: any) => {
            if (payload.senderId !== currentUserId) {
                setIsTyping(payload.isTyping);
            }
        };

        chatService.on('receive_message', handleReceiveMessage);
        chatService.on('user_typing', handleTyping);

        return () => {
            chatService.off('receive_message', handleReceiveMessage);
            chatService.off('user_typing', handleTyping);
            chatService.disconnect();
        };
    }, [workerId, user, token, roomId]);

    const handleSend = (text: string) => {
        if (!text.trim()) return;

        const newMessage: ChatMessage = {
            id: Date.now().toString(),
            roomId,
            senderId: currentUserId,
            content: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        // Optimistic update
        setMessages(prev => [...prev, newMessage]);
        chatService.sendMessage(roomId, text, currentUserId);
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
                    <Box className="px-md py-sm bg-surface-base border-b border-border-subtle flex-row items-center shadow-sm z-10">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 items-center justify-center mr-xs"
                            accessibilityLabel="Go back"
                            accessibilityRole="button"
                        >
                            <Ionicons name="arrow-back" size={24} color="#1F2937" />
                        </TouchableOpacity>

                        <Avatar name="Ramesh Kumar" size="sm" online />

                        <Box className="ml-sm flex-1">
                            <Text variant="h3" className="text-text-primary font-bold">Ramesh Kumar</Text>
                            {isTyping ? (
                                <Text variant="caption" className="text-brand-primary italic">Typing...</Text>
                            ) : (
                                <Text variant="caption" className="text-text-secondary">Plumber</Text>
                            )}
                        </Box>

                        <TouchableOpacity
                            className="w-10 h-10 bg-brand-primary/10 rounded-full items-center justify-center"
                            accessibilityLabel="Call Worker"
                            accessibilityRole="button"
                        >
                            <Ionicons name="call" size={20} color="#1A3B5D" />
                        </TouchableOpacity>
                    </Box>

                    {/* Messages */}
                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ChatBubble
                                message={item.content}
                                isSent={item.senderId === currentUserId}
                                timestamp={item.timestamp}
                            />
                        )}
                        contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'flex-end' }}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Input */}
                    <ChatInput onSend={handleSend} placeholder="Message Ramesh..." />
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Box>
    );
}
