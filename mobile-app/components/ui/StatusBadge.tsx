import { View, Text } from 'react-native';

type StatusBadgeProps = {
    status: 'urgent' | 'medium' | 'active' | 'completed' | 'pending' | 'online' | 'offline';
    size?: 'sm' | 'md' | 'lg';
};

const sizeClasses = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
};

const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
};

const variants = {
    urgent: 'bg-error/20 border border-error/50',
    medium: 'bg-warning/20 border border-warning/50',
    active: 'bg-neon-blue/20 border border-neon-blue/50',
    completed: 'bg-success/20 border border-success/50',
    pending: 'bg-warning/20 border border-warning/50',
    online: 'bg-success/20 border border-success',
    offline: 'bg-white/10 border border-white/30',
};

const textColors = {
    urgent: 'text-error',
    medium: 'text-warning',
    active: 'text-neon-blue',
    completed: 'text-success',
    pending: 'text-warning',
    online: 'text-success',
    offline: 'text-white/60',
};

const labels = {
    urgent: 'URGENT',
    medium: 'MEDIUM',
    active: 'ACTIVE',
    completed: 'COMPLETED',
    pending: 'PENDING',
    online: 'ONLINE',
    offline: 'OFFLINE',
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    return (
        <View className={`${variants[status]} ${sizeClasses[size]} rounded-pill items-center justify-center`}>
            <Text className={`${textColors[status]} ${textSizes[size]} font-bold tracking-wide`}>
                {labels[status]}
            </Text>
        </View>
    );
}
