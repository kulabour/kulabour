/**
 * KULABOUR - Animated Earnings Chart
 * Beautiful animated bar charts with Reanimated
 */

import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSpring,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface DataPoint {
    label: string;
    value: number;
    color?: string;
}

interface AnimatedChartProps {
    data: DataPoint[];
    height?: number;
    showLabels?: boolean;
    currency?: string;
    title?: string;
}

/**
 * Animated Bar Chart
 */
export function AnimatedBarChart({
    data,
    height = 200,
    showLabels = true,
    currency = '₹',
    title,
}: AnimatedChartProps) {
    const maxValue = Math.max(...data.map(d => d.value));
    const barWidth = (width - 80) / data.length - 8;

    return (
        <View className="bg-dark-charcoal rounded-2xl p-4 border border-white/10">
            {title && (
                <Text className="text-white font-bold text-lg mb-4">{title}</Text>
            )}

            {/* Chart area */}
            <View style={{ height }} className="flex-row items-end justify-between px-2">
                {data.map((item, index) => (
                    <AnimatedBar
                        key={index}
                        value={item.value}
                        maxValue={maxValue}
                        index={index}
                        height={height - 40}
                        width={barWidth}
                        color={item.color}
                    />
                ))}
            </View>

            {/* Labels */}
            {showLabels && (
                <View className="flex-row justify-between mt-3 px-2">
                    {data.map((item, index) => (
                        <View key={index} style={{ width: barWidth }} className="items-center">
                            <Text className="text-white/50 text-xs">{item.label}</Text>
                            <Text className="text-white/80 text-xs font-semibold mt-1">
                                {currency}{item.value}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

function AnimatedBar({
    value,
    maxValue,
    index,
    height,
    width,
    color,
}: {
    value: number;
    maxValue: number;
    index: number;
    height: number;
    width: number;
    color?: string;
}) {
    const progress = useSharedValue(0);
    const targetHeight = (value / maxValue) * height;

    useEffect(() => {
        progress.value = withDelay(
            index * 100,
            withSpring(1, { damping: 15, stiffness: 100 })
        );
    }, [value, maxValue]);

    const animatedStyle = useAnimatedStyle(() => {
        const currentHeight = interpolate(
            progress.value,
            [0, 1],
            [0, targetHeight],
            Extrapolation.CLAMP
        );

        return {
            height: currentHeight,
        };
    });

    const glowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 0.6]),
    }));

    return (
        <View style={{ width }} className="items-center">
            {/* Glow effect */}
            <Animated.View
                style={[
                    glowStyle,
                    {
                        position: 'absolute',
                        bottom: 0,
                        width: width + 20,
                        height: targetHeight + 20,
                        borderRadius: 12,
                        backgroundColor: color || '#00D9FF',
                        opacity: 0.2,
                        transform: [{ scale: 1.1 }],
                    }
                ]}
            />

            {/* Bar */}
            <Animated.View style={animatedStyle}>
                <LinearGradient
                    colors={[color || '#00D9FF', color ? `${color}99` : '#0078D4']}
                    className="w-full rounded-t-lg"
                    style={{ height: '100%', width, borderRadius: 8 }}
                />
            </Animated.View>
        </View>
    );
}

/**
 * Animated Line Chart (Simplified)
 */
export function AnimatedLineChart({
    data,
    height = 150,
    title,
}: AnimatedChartProps) {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(1, { duration: 1500 });
    }, []);

    const lineStyle = useAnimatedStyle(() => ({
        width: `${progress.value * 100}%`,
    }));

    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <View className="bg-dark-charcoal rounded-2xl p-4 border border-white/10">
            {title && (
                <Text className="text-white font-bold text-lg mb-4">{title}</Text>
            )}

            <View style={{ height }} className="flex-row items-end justify-between">
                {data.map((item, index) => {
                    const pointHeight = (item.value / maxValue) * (height - 20);
                    return (
                        <View key={index} className="items-center flex-1">
                            <Animated.View
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#00D9FF',
                                    marginBottom: pointHeight,
                                    shadowColor: '#00D9FF',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 8,
                                }}
                            />
                        </View>
                    );
                })}
            </View>

            {/* Labels */}
            <View className="flex-row justify-between mt-2">
                {data.map((item, index) => (
                    <Text key={index} className="text-white/50 text-xs flex-1 text-center">
                        {item.label}
                    </Text>
                ))}
            </View>
        </View>
    );
}

/**
 * Stat Card with Animation
 */
export function AnimatedStatCard({
    value,
    label,
    trend,
    icon,
}: {
    value: string | number;
    label: string;
    trend?: { value: number; positive: boolean };
    icon?: string;
}) {
    const scale = useSharedValue(0);
    const countValue = useSharedValue(0);

    useEffect(() => {
        scale.value = withSpring(1, { damping: 12 });
        if (typeof value === 'number') {
            countValue.value = withTiming(value, { duration: 1500 });
        }
    }, [value]);

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Animated.View style={containerStyle}>
            <LinearGradient
                colors={['#1A1F2E', '#141820']}
                className="rounded-2xl p-5 border border-white/10"
            >
                <View className="flex-row items-center mb-3">
                    {icon && <Text className="text-2xl mr-2">{icon}</Text>}
                    <Text className="text-white/60 text-sm">{label}</Text>
                </View>

                <Text className="text-white text-3xl font-black mb-2">
                    {typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : value}
                </Text>

                {trend && (
                    <View className={`flex-row items-center ${trend.positive ? 'bg-success/20' : 'bg-error/20'} self-start px-2 py-1 rounded-md`}>
                        <Text className={trend.positive ? 'text-success' : 'text-error'}>
                            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </Text>
                    </View>
                )}
            </LinearGradient>
        </Animated.View>
    );
}
