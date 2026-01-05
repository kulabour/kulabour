import React, { useRef, useEffect } from 'react';
import { View, Animated, Vibration, PanResponder, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface RippleProps {
    x: number;
    y: number;
    color?: string;
    onComplete: () => void;
}

function Ripple({ x, y, color = '#0078D4', onComplete }: RippleProps) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start(onComplete);
    }, []);

    return (
        <Animated.View
            style={{
                position: 'absolute',
                left: x - 100,
                top: y - 100,
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: color,
                opacity: opacityAnim,
                transform: [{ scale: scaleAnim }],
            }}
        />
    );
}

interface MagicTouchLayerProps {
    children: React.ReactNode;
}

export function MagicTouchLayer({ children }: MagicTouchLayerProps) {
    const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);
    const rippleIdRef = useRef(0);

    // Colors for different touch areas
    const getColorForPosition = (x: number, y: number) => {
        const normalizedY = y / SCREEN_HEIGHT;
        if (normalizedY < 0.3) return '#0078D4'; // Top - Blue
        if (normalizedY < 0.6) return '#107C10'; // Middle - Green
        return '#FFB900'; // Bottom - Gold
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { pageX, pageY } = evt.nativeEvent;

                // Haptic feedback
                Vibration.vibrate(10);

                // Add ripple
                const newRipple = {
                    id: rippleIdRef.current++,
                    x: pageX,
                    y: pageY,
                };
                setRipples((prev) => [...prev, newRipple]);
            },
            onPanResponderMove: (evt) => {
                const { pageX, pageY } = evt.nativeEvent;

                // Add trail ripples on drag
                if (Math.random() > 0.7) {
                    const newRipple = {
                        id: rippleIdRef.current++,
                        x: pageX + (Math.random() - 0.5) * 40,
                        y: pageY + (Math.random() - 0.5) * 40,
                    };
                    setRipples((prev) => [...prev, newRipple]);
                }
            },
        })
    ).current;

    const removeRipple = (id: number) => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
    };

    return (
        <View style={{ flex: 1 }} {...panResponder.panHandlers}>
            {children}

            {/* Ripple Layer */}
            <View style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {ripples.map((ripple) => (
                    <Ripple
                        key={ripple.id}
                        x={ripple.x}
                        y={ripple.y}
                        color={getColorForPosition(ripple.x, ripple.y)}
                        onComplete={() => removeRipple(ripple.id)}
                    />
                ))}
            </View>
        </View>
    );
}
