import { View, Text } from 'react-native';

interface ETAChipProps {
    minutes: number;
    label?: string;
}

export default function ETAChip({ minutes, label = 'ETA' }: ETAChipProps) {
    const getETAColor = () => {
        if (minutes <= 5) return 'bg-success/20 border-success text-success';
        if (minutes <= 15) return 'bg-warning/20 border-warning text-warning';
        return 'bg-neon-blue/20 border-neon-blue text-neon-blue';
    };

    const colorClasses = getETAColor();

    return (
        <View
            className={`${colorClasses.split('text-')[0]} px-4 py-2 rounded-pill flex-row items-center border-2 shadow-medium`}
        >
            <Text className="text-xl mr-2">⏱️</Text>
            <View>
                <Text className="text-white/60 text-xs font-semibold">
                    {label}
                </Text>
                <Text className={`${colorClasses.split('border-')[1]} text-lg font-bold`}>
                    {minutes} min
                </Text>
            </View>
        </View>
    );
}
