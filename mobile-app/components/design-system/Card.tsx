import React from 'react';
import { ViewProps, Platform } from 'react-native';
import { Box } from '../primitives/Box';

/**
 * Enterprise Card Component
 * 
 * The fundamental surface container for the design system.
 * Supports:
 * - Variants: Elevated (Default), Outlined, Glass, Filled
 * - Elevations: sm (1dp), md (4dp), lg (12dp)
 * - Padding Presets
 */

type CardVariant = 'elevated' | 'outlined' | 'glass' | 'filled';
type CardElevation = 'none' | 'sm' | 'md' | 'lg';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends ViewProps {
    variant?: CardVariant;
    elevation?: CardElevation;
    padding?: CardPadding;
}

export const Card = ({
    children,
    variant = 'elevated',
    elevation = 'md',
    padding = 'md',
    className = '',
    ...props
}: CardProps) => {

    // 1. Variant Styles
    const variantClasses = {
        elevated: 'bg-surface-base border border-border-subtle',
        outlined: 'bg-transparent border border-border-default',
        filled: 'bg-surface-subtle border-transparent',
        glass: 'bg-surface-glass border border-white/20', // Glassmorphism token
    };

    // 2. Elevation Styles (Shadows) - Only apply if not 'none' or 'glass'
    // Note: Glass usually doesn't have drop shadow, or has a very specific one.
    const elevationClasses = {
        none: '',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
    };

    // 3. Padding Presets
    const paddingClasses = {
        none: 'p-0',
        sm: 'p-sm',
        md: 'p-md',
        lg: 'p-lg',
    };

    // 4. Glass Effect Handling (Backdrop Blur)
    const isGlass = variant === 'glass';

    const combinedClasses = `
    rounded-lg 
    ${variantClasses[variant]} 
    ${!isGlass ? elevationClasses[elevation] : ''} 
    ${paddingClasses[padding]} 
    ${className}
  `;

    return (
        <Box className={combinedClasses} {...props}>
            {children}
        </Box>
    );
};
