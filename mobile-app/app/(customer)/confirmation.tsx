import { View, Text, Animated, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import '../../global.css';

export default function Confirmation() {
    const router = useRouter();
    const scaleAnim = useMemo(() => new Animated.Value(0), []);
    const fadeAnim = useMemo(() => new Animated.Value(0), []);

    useEffect(() => {
        // Success animation
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, [scaleAnim, fadeAnim]);

    return (
        <View className="flex-1 bg-[#020617]">
            <StatusBar barStyle="light-content" />
            <View className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <View className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px]" />
            </View>

            <SafeAreaView className="flex-1 items-center justify-center px-6">
                {/* Success Animation */}
                <View className="items-center mb-10">
                    <Animated.View
                        style={{
                            transform: [{ scale: scaleAnim }],
                        }}
                        className="w-32 h-32 bg-emerald-500/10 rounded-full items-center justify-center border border-emerald-500/30 mb-8 relative"
                    >
                        <View className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
                        <Ionicons name="checkmark" size={64} color="#10b981" />
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim }} className="items-center">
                        <Text className="text-white text-3xl font-bold text-center mb-3">
                            Booking Confirmed!
                        </Text>
                        <Text className="text-slate-400 text-center text-base max-w-[80%]">
                            We are looking for the nearest expert for your service.
                        </Text>
                    </Animated.View>
                </View>

                {/* Booking Summary Card */}
                <Animated.View style={{ opacity: fadeAnim }} className="w-full mb-8">
                    <LinearGradient
                        colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                        className="rounded-3xl p-1 border border-white/5"
                    >
                        <View className="bg-[#0f172a]/60 p-6 rounded-[22px] backdrop-blur-md">
                            <View className="flex-row justify-between items-center mb-6">
                                <View>
                                    <Text className="text-slate-400 text-xs uppercase tracking-wider mb-1">Service</Text>
                                    <Text className="text-white font-bold text-lg">Pipe Replacement</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-slate-400 text-xs uppercase tracking-wider mb-1">Time</Text>
                                    <Text className="text-white font-bold">14:00 Today</Text>
                                </View>
                            </View>

                            <View className="h-px bg-dashed border-t border-dashed border-white/10 my-2" />

                            <View className="flex-row justify-between items-center mt-4">
                                <View className="flex-row items-center">
                                    <View className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center mr-3">
                                        <Text className="text-xs text-white">📍</Text>
                                    </View>
                                    <View>
                                        <Text className="text-white text-sm font-medium">Koramangala</Text>
                                        <Text className="text-slate-500 text-xs">Bangalore</Text>
                                    </View>
                                </View>
                                <Text className="text-2xl font-bold text-emerald-400">₹528</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </Animated.View>

                {/* Tracking Preview */}
                <Animated.View style={{ opacity: fadeAnim }} className="w-full mb-8">
                    <View className="bg-blue-600/10 rounded-2xl p-4 border border-blue-500/20 flex-row items-center">
                        <View className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-3" />
                        <Text className="text-blue-200 text-sm flex-1">Searching nearby workers...</Text>
                        <Text className="text-blue-400 font-bold text-xs">EST 2m</Text>
                    </View>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View style={{ opacity: fadeAnim }} className="w-full space-y-4">
                    <TouchableOpacity
                        className="bg-white rounded-2xl py-4 items-center w-full"
                        onPress={() => router.push('/customer/track')}
                    >
                        <Text className="text-slate-900 font-bold text-lg">Track Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-transparent py-4 items-center w-full"
                        onPress={() => router.push('/(customer)')}
                    >
                        <Text className="text-slate-400 font-medium text-base">Back to Home</Text>
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}
