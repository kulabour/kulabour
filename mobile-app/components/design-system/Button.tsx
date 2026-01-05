import React from 'react';
import { Pressable, ActivityIndicator, ViewStyle } from 'react-native';
import { Text } from '../primitives/Text';
import { Box } from '../primitives/Box';

/**
 * Enterprise Button Component
 * 
 * A strict implementation of the design system's button methodology.
 * Supports:
 * - Variants: Solid (Primary), Outline (Secondary), Ghost (Tertiary)
 * - Sizes: sm, md, lg
 * - States: Default, Pressed, Disabled, Loading
 */

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    // Content
    children?: React.ReactNode;
    label?: string;
    icon?: React.ReactNode;

    // Style
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;

    // State
    isLoading?: boolean;
    isDisabled?: boolean;

    // Actions
    onPress?: () => void;

    // Accessibility
    accessibilityLabel?: string;
}

export const Button = ({
    children,
    label,
    icon,
    variant = 'solid',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    isDisabled = false,
    onPress,
    className = '',
    accessibilityLabel,
}: ButtonProps) => {

    // 1. Base Container Styles
    const baseStyles = "flex-row items-center justify-center rounded-md active:opacity-90 transition-opacity";
    const widthStyle = fullWidth ? "w-full" : "self-start";

    // 2. Size Variants (Vertical Padding + Min Height)
    const sizeStyles = {
        sm: "px-md py-sm h-[32px]", // py-2
        md: "px-lg py-md h-[48px]", // py-3
        lg: "px-xl py-lg h-[56px]", // py-4
    };

    // 3. Visual Variants (Bg / Border)
    const variantStyles = {
        solid: "bg-brand-primary border border-transparent",
        outline: "bg-transparent border border-brand-primary",
        ghost: "bg-transparent border-transparent hover:bg-surface-subtle",
        destructive: "bg-feedback-error border border-transparent",
    };

    // 4. Disabled State
    const disabledStyle = (isDisabled || isLoading) ? "opacity-50 pointer-events-none" : "";

    // 5. Text Color Logic
    const getTextColor = (): 'inverse' | 'brand' | 'primary' | 'error' => {
        if (variant === 'solid') return 'inverse'; // White text on Blue bg
        if (variant === 'destructive') return 'inverse';
        if (variant === 'outline') return 'brand'; // Blue text on White bg
        if (variant === 'ghost') return 'brand';
        return 'primary';
    };

    const getTextVariant = (): 'button' => 'button'; // Always use button typography

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled || isLoading}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel || label}
            accessibilityState={{
                disabled: isDisabled,
                busy: isLoading,
            }}
            className={`${baseStyles} ${widthStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${disabledStyle} ${className}`}
        >
            {isLoading ? (
                <ActivityIndicator
                    color={variant === 'solid' || variant === 'destructive' ? '#FFF' : '#1A3B5D'}
                    size="small"
                />
            ) : (
                <>
                    {icon && <Box className="mr-sm">{icon}</Box>}
                    {label ? (
                        <Text
                            variant={getTextVariant()}
                            color={getTextColor() as any}
                            className={variant === 'solid' ? 'text-white' : ''} // Force white for solid until text tokens fully propagate
                        >
                            {label}
                        </Text>
                    ) : children}
                </>
            )}
        </Pressable>
    );
};
