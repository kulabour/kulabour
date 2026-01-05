import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSpring,
    Easing
} from 'react-native-reanimated';

interface Layout3DProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    delay?: number;
}

export default function Layout3D({ children, style, delay = 0 }: Layout3DProps) {
    const opacity = useSharedValue(0);
    const rotateX = useSharedValue(15); // Start slightly rotated back
    const scale = useSharedValue(0.9);
    const translateY = useSharedValue(50);

    useEffect(() => {
        const timeout = setTimeout(() => {
            opacity.value = withTiming(1, { duration: 500 });
            rotateX.value = withSpring(0, { damping: 15, stiffness: 100 });
            scale.value = withSpring(1, { damping: 15, stiffness: 100 });
            translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
        }, delay);

        return () => clearTimeout(timeout);
    }, [delay]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [
                { perspective: 1000 },
                { rotateX: `${rotateX.value}deg` },
                { scale: scale.value },
                { translateY: translateY.value },
            ],
        };
    });

    return (
        <Animated.View style={[{ flex: 1 }, style, animatedStyle]}>
            {children}
        </Animated.View>
    );
}
