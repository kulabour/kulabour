import { View, Text, TouchableOpacity } from 'react-native';

interface FilterChipProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
    icon?: React.ReactNode;
}

export default function FilterChip({
    label,
    selected = false,
    onPress,
    icon,
}: FilterChipProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`px-4 py-2 rounded-pill flex-row items-center border-2 ${selected
                    ? 'bg-neon-blue/20 border-neon-blue shadow-glow-blue'
                    : 'bg-dark-charcoal border-white/20'
                }`}
            activeOpacity={0.7}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <Text
                className={`font-bold text-sm ${selected ? 'text-neon-blue' : 'text-white/70'
                    }`}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
}
