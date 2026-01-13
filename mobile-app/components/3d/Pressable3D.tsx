import React from 'react';
import { Pressable, ViewStyle, StyleProp, Vibration } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface Pressable3DProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
    depth?: number;
    color?: string;
}

export default function Pressable3D({
    children,
    onPress,
    style,
    depth = 6,
    color = '#005A9E'
}: Pressable3DProps) {
    const translateY = useSharedValue(0);
    const shadowOpacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const shadowStyle = useAnimatedStyle(() => {
        return {
            opacity: shadowOpacity.value,
            height: depth,
            backgroundColor: color,
            borderRadius: 20, // Assuming common border radius, could be a prop
            marginTop: -depth / 2, // Pull up slightly to hide under main view
            zIndex: -1,
            transform: [{ translateY: depth }],
        };
    });

    const handlePressIn = () => {
        Vibration.vibrate(10); // Haptic feedback
        translateY.value = withSpring(depth, { damping: 15, stiffness: 300 });
        shadowOpacity.value = withTiming(0.5, { duration: 100 });
    };

    const handlePressOut = () => {
        translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
        shadowOpacity.value = withTiming(1, { duration: 100 });
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[{ position: 'relative' }, style]}
        >
            <Animated.View style={animatedStyle}>
                {children}
            </Animated.View>

            {/* 3D Depth/Shadow Layer */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                    },
                    shadowStyle
                ]}
            />
        </Pressable>
    );
}
