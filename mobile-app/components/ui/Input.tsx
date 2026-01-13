import { View, TextInput, Text, Animated } from 'react-native';
import { useState, useEffect } from 'react';

interface InputProps {
    label?: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    multiline?: boolean;
    numberOfLines?: number;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    maxLength?: number;
    secureTextEntry?: boolean;
    icon?: React.ReactNode;
    leftIcon?: React.ReactNode;
    className?: string;
}

export default function Input({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    multiline = false,
    numberOfLines = 1,
    keyboardType = 'default',
    secureTextEntry = false,
    icon,
    leftIcon,
    maxLength,
    className = '',
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    // Use useState for stable animated value (lazy initialization)
    const [labelAnimation] = useState(() => new Animated.Value(value ? 1 : 0));

    useEffect(() => {
        Animated.timing(labelAnimation, {
            toValue: isFocused || value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value, labelAnimation]);

    const labelStyle = {
        top: labelAnimation.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }),
        fontSize: labelAnimation.interpolate({ inputRange: [0, 1], outputRange: [16, 12] }),
    };

    const borderColor = error ? 'border-error' : isFocused ? 'border-neon-blue' : 'border-white/10';
    const glowClass = error ? 'shadow-glow-red' : isFocused ? 'shadow-glow-blue' : '';

    return (
        <View className={`mb-4 ${className}`}>
            <View className={`bg-dark-charcoal rounded-xl px-4 border-2 ${borderColor} ${glowClass} ${multiline ? 'py-3' : 'py-4'}`}>
                {label && (
                    <Animated.Text style={labelStyle} className="text-white/50 absolute left-4">
                        {label}
                    </Animated.Text>
                )}
                <View className="flex-row items-center">
                    {icon && <View className="mr-3">{icon}</View>}
                    {leftIcon && <View className="mr-3">{leftIcon}</View>}
                    <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        placeholder={!isFocused && !label ? placeholder : ''}
                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                        className={`flex-1 text-white text-base ${label ? 'mt-5' : ''}`}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        multiline={multiline}
                        numberOfLines={numberOfLines}
                        keyboardType={keyboardType}
                        secureTextEntry={secureTextEntry}
                        maxLength={maxLength}
                    />
                </View>
            </View>
            {error && <Text className="text-error text-sm mt-1 ml-1">{error}</Text>}
        </View>
    );
}
