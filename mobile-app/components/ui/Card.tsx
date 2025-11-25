
import { View, ViewProps, Platform } from 'react-native';

interface CardProps extends ViewProps {
    variant?: 'default' | 'glass' | 'gradient' | 'outline';
    glassmorphism?: boolean;
    shadow?: 'none' | 'sm' | 'md' | 'lg' | '3d';
    className?: string;
}

export default function Card({
    children,
    variant = 'default',
    glassmorphism = false,
    shadow = 'md',
    className = '',
    style,
    ...props
}: CardProps) {

    const getVariantStyle = () => {
        switch (variant) {
            case 'glass':
                return 'bg-white/10 border border-white/20';
            case 'gradient':
                return 'bg-gradient-to-br from-dark-charcoal to-dark-navy border border-white/10';
            case 'outline':
                return 'bg-transparent border border-white/20';
            default:
                return 'bg-dark-charcoal border border-white/5';
        }
    };

    const getShadowStyle = () => {
        switch (shadow) {
            case 'none': return '';
            case 'sm': return 'shadow-sm';
            case 'lg': return 'shadow-lg';
            case '3d': return 'shadow-card-3d'; // Custom 3D shadow
            default: return 'shadow-md';
        }
    };

    const glassStyle = glassmorphism ? (Platform.OS === 'ios' ? 'backdrop-blur-lg' : '') : '';

    return (
        <View
            className={`rounded-2xl p-4 ${getVariantStyle()} ${getShadowStyle()} ${glassStyle} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </View>
    );
}
