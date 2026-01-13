import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from './DesignSystem';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle,
}: ButtonProps) => {

    const handlePress = () => {
        if (loading || disabled) return;
        Haptics.selectionAsync(); // Standard haptic feedback
        onPress();
    };

    const getBackgroundColor = () => {
        if (disabled) return COLORS.textTertiary;
        switch (variant) {
            case 'primary': return COLORS.primary;
            case 'secondary': return COLORS.primaryLight;
            case 'outline': return 'transparent';
            case 'danger': return COLORS.danger;
            default: return COLORS.primary;
        }
    };

    const getTextColor = () => {
        if (disabled) return '#FFF';
        switch (variant) {
            case 'primary': return '#FFF';
            case 'secondary': return COLORS.primary;
            case 'outline': return COLORS.primary;
            case 'danger': return '#FFF';
            default: return '#FFF';
        }
    };

    const paddingVertical = size === 'small' ? SPACING.xs : size === 'large' ? SPACING.m : SPACING.s;
    const paddingHorizontal = size === 'small' ? SPACING.m : size === 'large' ? SPACING.xl : SPACING.l;
    const fontSize = size === 'small' ? TYPOGRAPHY.small : size === 'large' ? TYPOGRAPHY.h3 : TYPOGRAPHY.body;

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.8}
            disabled={disabled || loading}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    paddingVertical,
                    paddingHorizontal,
                    borderColor: variant === 'outline' ? COLORS.primary : 'transparent',
                    borderWidth: variant === 'outline' ? 1.5 : 0,
                    opacity: disabled ? 0.6 : 1,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'secondary' || variant === 'outline' ? COLORS.primary : '#FFF'} />
            ) : (
                <>
                    {icon && <React.Fragment>{icon}</React.Fragment>}
                    <Text
                        style={[
                            styles.text,
                            {
                                color: getTextColor(),
                                fontSize,
                                marginLeft: icon ? 8 : 0,
                            },
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: RADIUS.m,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    text: {
        fontWeight: '600',
    },
});
