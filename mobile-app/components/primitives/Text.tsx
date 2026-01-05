import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

/**
 * Text Primitive
 * 
 * Enforces the typography scale defined in the Design System.
 * Developers should avoid using raw `className` for font-size/weight 
 * and instead use the `variant` prop.
 */

type TextVariant =
    | 'h1'   // Page Title (32px)
    | 'h2'   // Section Title (24px)
    | 'h3'   // Card Title (20px)
    | 'body' // Standard Text (16px)
    | 'caption' // Secondary Text (12px)
    | 'button'; // Button Labels (14px, Bold)

interface TextProps extends RNTextProps {
    variant?: TextVariant;
    color?: 'primary' | 'secondary' | 'brand' | 'error';
    // className prop is still allowed for overrides (margins, etc.)
}

export const Text = ({
    children,
    variant = 'body',
    color = 'primary',
    className = '',
    ...props
}: TextProps) => {

    const getVariantStyle = (v: TextVariant) => {
        switch (v) {
            case 'h1': return 'text-3xl font-bold tracking-tight';
            case 'h2': return 'text-2xl font-semibold tracking-tight';
            case 'h3': return 'text-xl font-semibold';
            case 'body': return 'text-base font-normal leading-relaxed';
            case 'caption': return 'text-xs font-medium';
            case 'button': return 'text-sm font-bold uppercase tracking-wide';
            default: return 'text-base';
        }
    };

    const getColorStyle = (c: string) => {
        switch (c) {
            case 'primary': return 'text-text-primary';
            case 'secondary': return 'text-text-secondary';
            case 'brand': return 'text-text-brand';
            case 'error': return 'text-feedback-error';
            default: return 'text-text-primary';
        }
    };

    /* Accessibility: specific roles for headers */
    const getAccessibilityRole = (): 'header' | 'text' => {
        if (variant === 'h1' || variant === 'h2') return 'header';
        return 'text';
    };

    const combinedClasses = `${getVariantStyle(variant)} ${getColorStyle(color)} ${className}`;

    return (
        <RNText
            className={combinedClasses}
            accessibilityRole={getAccessibilityRole()}
            {...props}
        >
            {children}
        </RNText>
    );
};
