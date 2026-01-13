import { View, ViewProps } from 'react-native';
import { ReactNode } from 'react';

export interface GlassCardProps extends ViewProps {
    children: ReactNode;
    variant?: 'default' | 'outlined' | 'elevated' | 'glass';
    glassmorphism?: boolean;
    shadow?: string;
}

/**
 * Professional UI Card Component
 * Supports glassmorphism, elevation, and outlines.
 */
export default function GlassCard({
    children,
    variant = 'default',

    className = '',
    ...props
}: GlassCardProps) {
    const variantStyles = {
        default: 'bg-dark-charcoal border border-white/5',
        outlined: 'bg-transparent border-2 border-white/10',
        elevated: 'bg-dark-charcoal border border-white/5 shadow-lg',
        glass: 'bg-dark-charcoal/80 backdrop-blur-glass border border-white/10',
    };

    return (
        <View
            className={`rounded-2xl p-4 ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </View>
    );
}
