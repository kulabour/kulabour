import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from './Input';
import { Box } from '../primitives/Box';

interface ChatInputProps {
    onSend: (message: string) => void;
    placeholder?: string;
    isLoading?: boolean;
}

export const ChatInput = ({ onSend, placeholder = "Type a message...", isLoading }: ChatInputProps) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (!message.trim()) return;
        onSend(message);
        setMessage('');
    };

    return (
        <Box className="flex-row items-center p-md bg-surface-base border-t border-border-subtle">
            <Box className="flex-1 mr-sm">
                <Input
                    value={message}
                    onChangeText={setMessage}
                    placeholder={placeholder}
                    containerClassName="mb-0 border-0 bg-surface-subtle rounded-full px-4"
                    accessibilityLabel="Chat message input"
                />
            </Box>
            <TouchableOpacity
                onPress={handleSend}
                disabled={!message.trim() || isLoading}
                className={`w-12 h-12 rounded-full items-center justify-center ${message.trim() ? 'bg-brand-primary' : 'bg-surface-muted'
                    }`}
                accessibilityRole="button"
                accessibilityLabel="Send message"
            >
                <Ionicons
                    name="send"
                    size={20}
                    color={message.trim() ? 'white' : '#94A3B8'}
                    style={{ marginLeft: 2 }} // Optical adjustment
                />
            </TouchableOpacity>
        </Box>
    );
};
