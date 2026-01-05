import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    withSpring,
    withTiming,
    withRepeat,
    withSequence,
    FadeInDown,
    FadeInRight,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { haptic } from '../../engine/HapticRhythm';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = 280;

export default function WorkerProfile() {
    const scrollY = useSharedValue(0);
    const [editPressed, setEditPressed] = useState<number | null>(null);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Parallax header animation
    const headerStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT],
            [0, -HEADER_HEIGHT / 2],
            Extrapolation.CLAMP
        );
        const scale = interpolate(
            scrollY.value,
            [-100, 0],
            [1.3, 1],
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            scrollY.value,
            [0, HEADER_HEIGHT / 2],
            [1, 0],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ translateY }, { scale }],
            opacity,
        };
    });

    // Floating header on scroll
    const floatingHeaderStyle = useAnimatedStyle(() => {
        const opacity = interpolate(
            scrollY.value,
            [HEADER_HEIGHT - 100, HEADER_HEIGHT],
            [0, 1],
            Extrapolation.CLAMP
        );
        const translateY = interpolate(
            scrollY.value,
            [HEADER_HEIGHT - 100, HEADER_HEIGHT],
            [-20, 0],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ translateY }],
        };
    });

    const StatCard = ({ value, label, delay, icon }: { value: string; label: string; delay: number; icon: string }) => {
        const shimmer = useSharedValue(0);

        React.useEffect(() => {
            shimmer.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 1500 }),
                    withTiming(0, { duration: 1500 })
                ),
                -1,
                true
            );
        }, []);

        const shimmerStyle = useAnimatedStyle(() => {
            const translateX = interpolate(
                shimmer.value,
                [0, 1],
                [-width, width],
                Extrapolation.CLAMP
            );
            return {
                transform: [{ translateX }],
            };
        });

        return (
            <Animated.View
                entering={FadeInDown.delay(delay).springify()}
                className="w-1/2 p-2"
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => haptic('tap')}
                >
                    <View className="bg-white p-5 rounded-2xl overflow-hidden" style={{
                        shadowColor: '#0078D4',
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.12,
                        shadowRadius: 16,
                        elevation: 8,
                    }}>
                        {/* Shimmer overlay */}
                        <Animated.View
                            style={[
                                shimmerStyle,
                                {
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    width: width / 2,
                                }
                            ]}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ flex: 1 }}
                            />
                        </Animated.View>

                        <View className="items-center">
                            <View className="w-12 h-12 bg-primary/10 rounded-full items-center justify-center mb-2">
                                <Ionicons name={icon as any} size={24} color="#0078D4" />
                            </View>
                            <Text className="text-4xl font-black text-secondary mb-1">{value}</Text>
                            <Text className="text-gray-500 text-xs font-semibold">{label}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    };

    const MenuOption = ({ icon, label, color, index }: { icon: string; label: string; color?: string; index: number }) => {
        const pressed = useSharedValue(0);

        const tap = Gesture.Tap()
            .onBegin(() => {
                pressed.value = withSpring(1, { damping: 15 });
                haptic('tap');
            })
            .onFinalize(() => {
                pressed.value = withSpring(0, { damping: 15 });
            });

        const animatedStyle = useAnimatedStyle(() => {
            const scale = interpolate(pressed.value, [0, 1], [1, 0.97]);
            const backgroundColor = color ? 'rgba(255, 61, 0, 0.05)' : 'transparent';

            return {
                transform: [{ scale }],
            };
        });

        return (
            <GestureDetector gesture={tap}>
                <Animated.View
                    entering={FadeInRight.delay(index * 50).springify()}
                    style={animatedStyle}
                    className="border-b border-gray-100"
                >
                    <View className="p-4 flex-row items-center">
                        <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center mr-3">
                            <Ionicons name={icon as any} size={20} color={color || '#1A1D24'} />
                        </View>
                        <Text className="flex-1 font-semibold text-base" style={{ color: color || '#1A1D24' }}>
                            {label}
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                    </View>
                </Animated.View>
            </GestureDetector>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Floating Header */}
            <Animated.View
                style={[
                    floatingHeaderStyle,
                    {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        paddingTop: 50,
                        paddingBottom: 16,
                    }
                ]}
            >
                <LinearGradient
                    colors={['#1A1D24', '#2A2D34']}
                    className="px-4"
                >
                    <Text className="text-white font-bold text-lg">Ramesh Kumar</Text>
                </LinearGradient>
            </Animated.View>

            <Animated.ScrollView
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                {/* Parallax Profile Header */}
                <Animated.View style={[headerStyle]}>
                    <LinearGradient
                        colors={['#1A1D24', '#2A2D34', '#3A3D44']}
                        className="pt-16 pb-12 items-center rounded-b-[40px]"
                        style={{
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.3,
                            shadowRadius: 20,
                            elevation: 20,
                        }}
                    >
                        {/* Profile Picture with Glow */}
                        <Animated.View
                            entering={FadeInDown.delay(200).springify()}
                            className="mb-4"
                        >
                            <View style={{
                                shadowColor: '#0078D4',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.6,
                                shadowRadius: 20,
                            }}>
                                <LinearGradient
                                    colors={['#0078D4', '#00A4EF']}
                                    className="w-28 h-28 rounded-full border-4 border-white items-center justify-center"
                                >
                                    <Text className="text-5xl">👷‍♂️</Text>
                                </LinearGradient>
                            </View>
                        </Animated.View>

                        {/* Name & Title */}
                        <Animated.View entering={FadeInDown.delay(300).springify()} className="items-center mb-3">
                            <Text className="text-3xl font-black text-white mb-1">Ramesh Kumar</Text>
                            <View className="flex-row items-center">
                                <Ionicons name="location" size={14} color="#A0AEC0" />
                                <Text className="text-gray-400 ml-1 font-medium">Expert Mason • Noida Sector 62</Text>
                            </View>
                        </Animated.View>

                        {/* Gold Partner Badge */}
                        <Animated.View entering={FadeInDown.delay(400).springify()}>
                            <LinearGradient
                                colors={['#FFB900', '#FFA000']}
                                className="px-4 py-2 rounded-full flex-row items-center"
                                style={{
                                    shadowColor: '#FFB900',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.5,
                                    shadowRadius: 12,
                                }}
                            >
                                <Ionicons name="star" size={18} color="#FFF" />
                                <Text className="text-white font-black ml-2 text-sm">GOLD PARTNER</Text>
                            </LinearGradient>
                        </Animated.View>
                    </LinearGradient>
                </Animated.View>

                {/* Stats Grid with Shimmer */}
                <View className="flex-row flex-wrap px-2 -mt-12">
                    <StatCard value="4.8" label="Rating" delay={100} icon="star" />
                    <StatCard value="152" label="Jobs Done" delay={200} icon="hammer" />
                    <StatCard value="₹48.2k" label="Earned" delay={300} icon="wallet" />
                    <StatCard value="98%" label="Success Rate" delay={400} icon="trending-up" />
                </View>

                {/* Menu Options */}
                <View className="p-4 mt-4">
                    <Text className="font-black text-secondary mb-3 text-lg">Settings</Text>
                    <View className="bg-white rounded-2xl overflow-hidden" style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 12,
                        elevation: 4,
                    }}>
                        <MenuOption icon="person" label="Edit Profile" index={0} />
                        <MenuOption icon="document-text" label="Documents & KYC" index={1} />
                        <MenuOption icon="bicycle" label="Vehicle Details" index={2} />
                        <MenuOption icon="notifications" label="Notifications" index={3} />
                        <MenuOption icon="headset" label="Help & Support" index={4} />
                        <MenuOption icon="log-out" label="Logout" color="#FF3D00" index={5} />
                    </View>
                </View>

                <View className="h-20" />
            </Animated.ScrollView>
        </SafeAreaView>
    );
}
