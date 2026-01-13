// Job Request Modal
import { Modal, View, Text, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useMemo } from 'react';
import Button from '../ui/Button';
import Card from '../ui/GlassCard';

interface Job {
    id: number;
    title: string;
    price: string;
    customerName: string;
    location: string;
    time: string;
    category: string;
}

interface JobRequestModalProps {
    visible: boolean;
    job: Job | null;
    onAccept: () => void;
    onReject: () => void;
    autoRejectTime?: number; // in seconds
}

export default function JobRequestModal({
    visible,
    job,
    onAccept,
    onReject,
    autoRejectTime = 30,
}: JobRequestModalProps) {
    const slideAnim = useMemo(() => new Animated.Value(0), []);
    const timerAnim = useMemo(() => new Animated.Value(1), []);

    useEffect(() => {
        if (visible) {
            // Slide up animation
            Animated.spring(slideAnim, {
                toValue: 1,
                useNativeDriver: true,
                damping: 15,
            }).start();

            // Timer countdown animation
            Animated.timing(timerAnim, {
                toValue: 0,
                duration: autoRejectTime * 1000,
                useNativeDriver: false,
            }).start();

            // Auto reject after timeout
            const timeout = setTimeout(onReject, autoRejectTime * 1000);
            return () => clearTimeout(timeout);
        } else {
            slideAnim.setValue(0);
            timerAnim.setValue(1);
        }
    }, [visible, autoRejectTime, onReject, slideAnim, timerAnim]);

    if (!job) return null;

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [500, 0],
    });

    const timerWidth = timerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onReject}
        >
            <View className="flex-1 bg-black/80 justify-end">
                <TouchableOpacity
                    className="flex-1"
                    activeOpacity={1}
                    onPress={onReject}
                />
                <Animated.View
                    style={{ transform: [{ translateY }] }}
                    className="bg-dark-navy rounded-t-3xl"
                >
                    {/* Timer Progress Bar */}
                    <View className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <Animated.View
                            style={{ width: timerWidth }}
                            className="h-full bg-warning"
                        />
                    </View>

                    <View className="p-6">
                        {/* Header */}
                        <View className="items-center mb-6">
                            <View className="w-16 h-16 rounded-full bg-neon-blue/20 items-center justify-center mb-3">
                                <Text className="text-4xl">🔔</Text>
                            </View>
                            <Text className="text-white text-2xl font-bold mb-1">
                                New Job Request!
                            </Text>
                            <Text className="text-white/50 text-sm">
                                Auto-reject in {autoRejectTime}s
                            </Text>
                        </View>

                        {/* Job Details */}
                        <Card variant="glass" shadow="medium" className="mb-6">
                            <View className="flex-row items-start mb-4">
                                <View className="flex-1">
                                    <Text className="text-white text-xl font-bold mb-2">
                                        {job.title}
                                    </Text>
                                    <Text className="text-white/60 text-sm mb-1">
                                        {job.customerName}
                                    </Text>
                                    <View className="bg-neon-blue/20 self-start px-2 py-1 rounded-md">
                                        <Text className="text-neon-blue text-xs font-bold">
                                            {job.category}
                                        </Text>
                                    </View>
                                </View>
                                <View className="bg-success/20 px-4 py-2 rounded-xl">
                                    <Text className="text-success text-2xl font-bold">
                                        {job.price}
                                    </Text>
                                </View>
                            </View>

                            <View className="space-y-2">
                                <View className="flex-row items-center">
                                    <Text className="text-xl mr-2">📍</Text>
                                    <Text className="text-white/70 text-sm flex-1">
                                        {job.location}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Text className="text-xl mr-2">⏰</Text>
                                    <Text className="text-white/70 text-sm">
                                        {job.time}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3">
                            <View className="flex-1">
                                <Button
                                    variant="ghost"
                                    size="lg"
                                    onPress={onReject}
                                >
                                    Reject
                                </Button>
                            </View>
                            <View className="flex-1">
                                <Button
                                    variant="success"
                                    size="lg"
                                    glow
                                    onPress={onAccept}
                                >
                                    Accept Job
                                </Button>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}
