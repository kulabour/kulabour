import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import '../../global.css';

// Only import map on native platforms
const LiveTrackingMap = Platform.OS === 'web'
    ? null
    : require('../../components/maps/LiveTrackingMap').default;

export default function Track() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState(15);
    const [status, setStatus] = useState('Worker on the way');

    const customerLocation = { latitude: 12.9716, longitude: 77.5946 };
    const workerLocation = {
        latitude: 12.9716 + (0.02 * (1 - progress / 100)),
        longitude: 77.5946 + (0.02 * (1 - progress / 100))
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setStatus('Worker arrived');
                    return 100;
                }
                const newProgress = prev + 5;
                setEta(Math.max(0, Math.floor(15 * (1 - newProgress / 100))));
                return newProgress;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            {/* Header */}
            <View className="px-6 py-4 flex-row items-center border-b border-white/10">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <Text className="text-white text-2xl">←</Text>
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Track Worker</Text>
            </View>

            {/* Map or Web Placeholder */}
            {Platform.OS === 'web' ? (
                <View className="flex-1 bg-dark-charcoal items-center justify-center">
                    <View className="items-center p-8">
                        <Text className="text-6xl mb-4">🗺️</Text>
                        <Text className="text-white text-2xl font-bold mb-2">Live Tracking</Text>
                        <Text className="text-white/70 text-center mb-6">
                            Map view available on mobile app{'\n'}
                            Download Expo Go to see live tracking
                        </Text>

                        {/* Status Cards */}
                        <View className="w-full max-w-md space-y-4">
                            <View className="bg-dark-navy rounded-2xl p-4 border border-neon-blue/30">
                                <Text className="text-white/70 text-sm mb-1">Worker Status</Text>
                                <Text className="text-white text-xl font-bold">{status}</Text>
                            </View>

                            <View className="bg-dark-navy rounded-2xl p-4 border border-neon-green/30">
                                <Text className="text-white/70 text-sm mb-1">Estimated Arrival</Text>
                                <Text className="text-neon-green text-3xl font-bold">{eta} mins</Text>
                            </View>

                            <View className="bg-dark-navy rounded-2xl p-4 border border-white/10">
                                <Text className="text-white/70 text-sm mb-1">Progress</Text>
                                <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <View
                                        className="h-full bg-neon-blue rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </View>
                                <Text className="text-white text-right mt-1">{progress.toFixed(0)}%</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ) : LiveTrackingMap ? (
                <LiveTrackingMap
                    customerLocation={customerLocation}
                    workerLocation={workerLocation}
                    onRegionChange={() => { }}
                />
            ) : null}

            {/* Bottom Info */}
            <View className="px-6 py-6 bg-dark-charcoal border-t border-white/10">
                <View className="flex-row items-center mb-4">
                    <View className="w-12 h-12 rounded-full bg-neon-blue/20 items-center justify-center mr-4">
                        <Text className="text-2xl">👨‍🔧</Text>
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg">Rajesh Kumar</Text>
                        <Text className="text-white/60">4.8 ⭐ • 234 jobs</Text>
                    </View>
                    <TouchableOpacity className="w-12 h-12 rounded-full bg-neon-green/20 items-center justify-center">
                        <Text className="text-2xl">📞</Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row space-x-3">
                    <TouchableOpacity className="flex-1 bg-neon-blue/20 border border-neon-blue/30 rounded-2xl py-4 items-center">
                        <Text className="text-neon-blue font-bold">Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-red-500/20 border border-red-500/30 rounded-2xl py-4 items-center">
                        <Text className="text-red-400 font-bold">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
