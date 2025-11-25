import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'glass' | 'ghost' | 'icon' | 'success' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
    children?: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    glow?: boolean;
    icon?: ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    className?: string;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    glow = false,
    icon,
    onPress,
    disabled = false,
    loading = false,
    fullWidth = false,
    className = '',
}: ButtonProps) {
    const sizeClasses = {
        sm: 'px-4 py-2',
        md: 'px-6 py-3',
        lg: 'px-8 py-4',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    };

    const iconSizes = {
        sm: 'w-10 h-10',
        md: 'w-12 h-12',
        lg: 'w-14 h-14',
    };

    const variantClasses = {
        primary: `bg-neon-blue ${glow ? 'shadow-glow-blue' : ''}`,
        glass: 'bg-white/10 border-2 border-white/20',
        ghost: 'bg-transparent border-2 border-neon-blue',
        icon: `bg-dark-charcoal ${glow ? 'shadow-glow-blue' : ''}`,
        success: `bg-success ${glow ? 'shadow-glow-green' : ''}`,
        danger: `bg-error ${glow ? 'shadow-glow-red' : ''}`,
    };

    const textColors = {
        primary: 'text-white',
        glass: 'text-white',
        ghost: 'text-neon-blue',
        icon: 'text-white',
        success: 'text-dark-navy',
        danger: 'text-white',
    };

    const disabledClass = disabled ? 'opacity-40' : 'active:scale-95';

    if (variant === 'icon') {
        return (
            <TouchableOpacity
                className={`${iconSizes[size]} rounded-pill items-center justify-center ${variantClasses[variant]} ${disabledClass} ${className}`}
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.8}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    icon
                )}
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-xl items-center justify-center flex-row ${fullWidth ? 'w-full' : ''} ${disabledClass} ${className}`}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <>
                    {icon && <View className="mr-2">{icon}</View>}
                    {children && (
                        <Text className={`${textColors[variant]} ${textSizes[size]} font-bold`}>
                            {children}
                        </Text>
                    )}
                </>
            )}
        </TouchableOpacity>
    );
}
