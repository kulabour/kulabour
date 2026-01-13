import { View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface ChatInputProps {
    onSend: (message: string) => void;
    onStartRecording?: () => void;
    placeholder?: string;
}

export default function ChatInput({
    onSend,
    onStartRecording,
    placeholder = 'Type a message...',
}: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSend(message.trim());
            setMessage('');
            Keyboard.dismiss();
        }
    };

    return (
        <View className="px-4 py-3 bg-dark-charcoal border-t border-white/10 flex-row items-end">
            <View className="flex-1 bg-dark-obsidian rounded-2xl px-4 py-3 mr-3 border border-white/10 flex-row items-center">
                <TextInput
                    value={message}
                    onChangeText={setMessage}
                    placeholder={placeholder}
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    className="text-white text-base max-h-24 flex-1"
                    multiline
                />
            </View>

            {message.trim() ? (
                <TouchableOpacity
                    onPress={handleSend}
                    className="w-12 h-12 rounded-full items-center justify-center bg-neon-blue shadow-glow-blue"
                    activeOpacity={0.7}
                >
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    onPress={onStartRecording}
                    className="w-12 h-12 rounded-full items-center justify-center bg-white/10"
                    activeOpacity={0.7}
                >
                    <Ionicons name="mic" size={24} color="white" />
                </TouchableOpacity>
            )}
        </View>
    );
}
