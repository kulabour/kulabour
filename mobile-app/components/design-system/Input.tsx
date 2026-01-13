import React, { useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { Text } from '../primitives/Text';
import { Box } from '../primitives/Box';

/**
 * Enterprise Input Component
 * 
 * A strict implementation of the design system's input field.
 * Supports:
 * - Label: Top-aligned, semantic color
 * - HelperText: Bottom-aligned, supports error state
 * - States: Default, Focus, Error, Disabled
 * - Icons: Left/Right slots
 */

interface InputProps extends TextInputProps {
    label?: string;
    helperText?: string;
    errorText?: string;

    // Slots
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;

    // Style Overrides (Use sparingly)
    containerClassName?: string;
}

export const Input = ({
    label,
    helperText,
    errorText,
    leftIcon,
    rightIcon,
    editable = true,
    onFocus,
    onBlur,
    containerClassName = '',
    ...props
}: InputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    // 1. Border Logic
    const getBorderColor = () => {
        if (errorText) return 'border-feedback-error';
        if (isFocused) return 'border-brand-primary'; // Focus ring
        return 'border-border-default';
    };

    const getBackgroundColor = () => {
        if (!editable) return 'bg-surface-muted';
        return isFocused ? 'bg-surface-base' : 'bg-surface-base';
    };

    // 2. Base Input Styles
    const baseInputStyles = `
    flex-1 
    text-base 
    text-text-primary 
    h-full 
    ${!editable && 'text-text-tertiary'}
  `;

    // 3. Container Styles (Height fix: h-[50px])
    const containerClasses = `
    flex-row items-center 
    rounded-md 
    border 
    h-[50px]
    px-md
    ${getBorderColor()} 
    ${getBackgroundColor()}
  `;

    return (
        <Box className={`w-full mb-md ${containerClassName}`}>
            {/* Label */}
            {label && (
                <Text
                    variant="caption"
                    className="mb-xs text-text-secondary font-medium uppercase tracking-wide"
                    accessibilityRole="text"
                >
                    {label}
                </Text>
            )}

            {/* Input Container */}
            <Box className={containerClasses}>
                {leftIcon && <Box className="mr-sm">{leftIcon}</Box>}

                <TextInput
                    placeholderTextColor="#94A3B8"
                    accessibilityLabel={label}
                    accessibilityHint={helperText}
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    editable={editable}
                    className={baseInputStyles}
                    {...props}
                />

                {rightIcon && <Box className="ml-sm">{rightIcon}</Box>}
            </Box>

            {/* Helper / Error Text */}
            {(errorText || helperText) && (
                <Text
                    variant="caption"
                    className={`mt-xs ${errorText ? 'text-feedback-error' : 'text-text-tertiary'}`}
                >
                    {errorText || helperText}
                </Text>
            )}
        </Box>
    );
};
