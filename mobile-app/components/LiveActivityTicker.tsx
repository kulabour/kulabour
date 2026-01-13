import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface LiveUpdate {
    id: number;
    type: 'booking' | 'rating' | 'online' | 'complete';
    message: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

const LIVE_UPDATES: LiveUpdate[] = [
    { id: 1, type: 'booking', message: 'राजेश ने Plumber बुक किया • 2 min ago', icon: 'checkmark-circle', color: '#107C10' },
    { id: 2, type: 'rating', message: 'सुनील को 5⭐ मिला • 5 min ago', icon: 'star', color: '#FFB900' },
    { id: 3, type: 'online', message: '12 नए मिस्त्री online आए • 10 min ago', icon: 'radio', color: '#00B7C3' },
    { id: 4, type: 'complete', message: 'विकास ने job पूरी की • 15 min ago', icon: 'trophy', color: '#8764B8' },
    { id: 5, type: 'booking', message: 'प्रिया ने Electrician बुक किया • 18 min ago', icon: 'checkmark-circle', color: '#107C10' },
];

function TickerItem({ update, delay }: { update: LiveUpdate; delay: number }) {
    const slideAnim = useRef(new Animated.Value(width)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startAnimation = () => {
            slideAnim.setValue(width);
            opacityAnim.setValue(0);

            Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 800,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.delay(4000),
                Animated.parallel([
                    Animated.timing(slideAnim, {
                        toValue: -width,
                        duration: 800,
                        easing: Easing.in(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 0,
                        duration: 600,
                        useNativeDriver: true,
                    }),
                ]),
            ]).start(() => startAnimation());
        };

        startAnimation();
    }, [delay]);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 10,
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: 12,
                transform: [{ translateX: slideAnim }],
                opacity: opacityAnim,
            }}
        >
            <View
                style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: `${update.color}20`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                }}
            >
                <Ionicons name={update.icon} size={18} color={update.color} />
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, flex: 1 }}>
                {update.message}
            </Text>
        </Animated.View>
    );
}

export function LiveActivityTicker() {
    return (
        <View
            style={{
                height: 52,
                marginHorizontal: 16,
                marginVertical: 12,
                overflow: 'hidden',
                borderRadius: 12,
            }}
        >
            {LIVE_UPDATES.map((update, index) => (
                <TickerItem
                    key={update.id}
                    update={update}
                    delay={index * 5000}
                />
            ))}
        </View>
    );
}
