import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

interface VoiceMessageProps {
    uri: string;
    duration: number;
}

export default function VoiceMessage({ uri, duration }: VoiceMessageProps) {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    async function playSound() {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } else {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri },
                { shouldPlay: true },
                onPlaybackStatusUpdate
            );
            setSound(newSound);
            setIsPlaying(true);
        }
    }

    import { AVPlaybackStatus } from 'expo-av';

    // ...

    function onPlaybackStatusUpdate(status: AVPlaybackStatus) {
        if (status.isLoaded) {
            setPosition(status.positionMillis / 1000);
            if (status.didJustFinish) {
                setIsPlaying(false);
                setPosition(0);
                // sound?.setPositionAsync(0); // Optional: reset to start
            }
        }
    }

    function formatDuration(seconds: number) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    return (
        <View className="flex-row items-center bg-white/10 rounded-2xl p-3 min-w-[150px]">
            <TouchableOpacity onPress={playSound} className="bg-white/20 rounded-full p-2 mr-3">
                <Ionicons name={isPlaying ? "pause" : "play"} size={20} color="white" />
            </TouchableOpacity>

            <View className="flex-1">
                <View className="h-1 bg-white/20 rounded-full mb-1 overflow-hidden">
                    <View
                        className="h-full bg-neon-blue"
                        style={{ width: `${(position / duration) * 100}%` }}
                    />
                </View>
                <Text className="text-white/60 text-xs">
                    {formatDuration(position)} / {formatDuration(duration)}
                </Text>
            </View>
        </View>
    );
}
