import { View, Text, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import Card from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import '../../global.css';

export default function Confirmation() {
    const router = useRouter();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

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
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-dark-navy">
            <ScrollView
                className="flex-1"
                contentContainerClassName="items-center justify-center px-6"
                showsVerticalScrollIndicator={false}
            >
                {/* Success Animation */}
                <View className="items-center mt-20 mb-8">
                    <Animated.View
                        style={{
                            transform: [{ scale: scaleAnim }],
                        }}
                        className="w-32 h-32 bg-success/20 rounded-full items-center justify-center shadow-glow-green-lg mb-6"
                    >
                        <Text className="text-7xl">✓</Text>
                    </Animated.View>

                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text className="text-white text-3xl font-bold text-center mb-2">
                            Booking Confirmed!
                        </Text>
                        <Text className="text-white/60 text-center text-base">
                            Your service has been booked successfully
                        </Text>
                    </Animated.View>
                </View>

                {/* Booking Summary */}
                <Animated.View style={{ opacity: fadeAnim }} className="w-full mb-6">
                    <Card variant="elevated" shadow="3d">
                        <Text className="text-white text-lg font-bold mb-4">
                            Booking Summary
                        </Text>

                        <View className="space-y-3">
                            <View>
                                <Text className="text-white/50 text-xs mb-1">Service</Text>
                                <Text className="text-white font-semibold text-base">
                                    Pipe Replacement
                                </Text>
                            </View>

                            <View>
                                <Text className="text-white/50 text-xs mb-1">Booking ID</Text>
                                <Text className="text-neon-blue font-mono text-base">
                                    #BK{Date.now().toString().slice(-6)}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-white/50 text-xs mb-1">Address</Text>
                                <Text className="text-white text-sm">
                                    Koramangala, 4th Block, Flat 402
                                </Text>
                            </View>

                            <View>
                                <Text className="text-white/50 text-xs mb-1">Scheduled Time</Text>
                                <Text className="text-white text-sm">Today at 3:00 PM</Text>
                            </View>

                            <View className="h-px bg-white/10 my-2" />

                            <View className="flex-row justify-between items-center">
                                <Text className="text-white font-bold text-lg">Total Paid</Text>
                                <Text className="text-success font-bold text-2xl">₹528</Text>
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Worker Assignment Card */}
                <Animated.View style={{ opacity: fadeAnim }} className="w-full mb-6">
                    <Card variant="glass" shadow="medium">
                        <View className="items-center">
                            <View className="w-20 h-20 bg-neon-blue/20 rounded-full items-center justify-center mb-3">
                                <Text className="text-5xl">👷</Text>
                            </View>
                            <Text className="text-white/70 text-sm mb-1">
                                Finding the best worker for you...
                            </Text>
                            <View className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                                <View className="h-full w-1/2 bg-neon-blue animate-pulse" />
                            </View>
                        </View>
                    </Card>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View style={{ opacity: fadeAnim }} className="w-full gap-3">
                    <Button
                        variant="primary"
                        size="lg"
                        glow
                        fullWidth
                        onPress={() => router.push('/customer/track')}
                    >
                        Track Your Order
                    </Button>
                    <Button
                        variant="ghost"
                        size="lg"
                        fullWidth
                        onPress={() => router.push('/customer')}
                    >
                        Back to Home
                    </Button>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}
