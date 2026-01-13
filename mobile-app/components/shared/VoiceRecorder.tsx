import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface VoiceRecorderProps {
    onSend: (uri: string, duration: number) => void;
    onCancel: () => void;
}

export default function VoiceRecorder({ onSend, onCancel }: VoiceRecorderProps) {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [duration, setDuration] = useState(0);
    const [isRecording, setIsRecording] = useState(false);

    async function startRecording() {
        try {
            const permission = await Audio.requestPermissionsAsync();
            if (permission.status === 'granted') {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });

                const { recording } = await Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                );
                setRecording(recording);
                setIsRecording(true);
            } else {
                Alert.alert('Permission Required', 'Please grant microphone permission to record voice messages.');
            }
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        if (!recording) return;

        setIsRecording(false);
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();

        if (uri) {
            onSend(uri, duration);
        }
        setRecording(null);
        setDuration(0);
    }

    function formatDuration(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setDuration((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    useEffect(() => {
        // Wrap in setTimeout to avoid setting state synchronously in effect (lint warning)
        setTimeout(() => startRecording(), 0);
    }, []);

    return (
        <View className="flex-row items-center bg-white/10 rounded-full px-4 py-2 flex-1 mx-2">
            <TouchableOpacity onPress={onCancel} className="mr-4">
                <Ionicons name="trash-outline" size={24} color="#ff4444" />
            </TouchableOpacity>

            <View className="flex-1 flex-row items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" />
                <Text className="text-white font-mono">{formatDuration(duration)}</Text>
            </View>

            <TouchableOpacity onPress={stopRecording} className="ml-4 bg-neon-blue rounded-full p-2">
                <Ionicons name="send" size={20} color="white" />
            </TouchableOpacity>
        </View>
    );
}
