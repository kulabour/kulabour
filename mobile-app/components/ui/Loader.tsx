import { View, ActivityIndicator } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'teal';
}

export default function Loader({ size = 'md', color = 'blue' }: LoaderProps) {
    const rotateAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnimation, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const rotate = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    const colors = {
        blue: 'border-neon-blue/30 border-t-neon-blue',
        green: 'border-success/30 border-t-success',
        teal: 'border-neon-teal/30 border-t-neon-teal',
    };

    return (
        <Animated.View
            style={{ transform: [{ rotate }] }}
            className={`${sizes[size]} ${colors[color]} rounded-full border-4`}
        />
    );
}
