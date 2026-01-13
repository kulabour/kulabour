import { View, Text, TouchableOpacity } from 'react-native';

type JobCardProps = {
    title: string;
    price: string;
    customerName: string;
    location: string;
    time: string;
    priority?: 'urgent' | 'medium';
    onPress: () => void;
};

export default function JobCard({
    title,
    price,
    customerName,
    location,
    time,
    priority = 'medium',
    onPress
}: JobCardProps) {
    const priorityColors = {
        urgent: 'border-error shadow-glow-green',
        medium: 'border-neon-blue/30',
    };

    return (
        <TouchableOpacity
            className={`bg-dark-charcoal rounded-card-lg border ${priorityColors[priority]} p-4 mb-4`}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {/* Header */}
            <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                    <Text className="text-white text-lg font-bold mb-1">{title}</Text>
                    <Text className="text-white/60 text-sm">{customerName}</Text>
                </View>
                <View className="bg-neon-blue/20 px-3 py-1 rounded-pill">
                    <Text className="text-neon-blue font-bold">{price}</Text>
                </View>
            </View>

            {/* Details */}
            <View className="space-y-2">
                <View className="flex-row items-center">
                    <Text className="text-2xl mr-2">📍</Text>
                    <Text className="text-white/70 text-sm flex-1">{location}</Text>
                </View>
                <View className="flex-row items-center">
                    <Text className="text-2xl mr-2">⏰</Text>
                    <Text className="text-white/70 text-sm">{time}</Text>
                </View>
            </View>

            {/* Priority Badge */}
            {priority === 'urgent' && (
                <View className="mt-3 bg-error/20 px-3 py-1 rounded-pill self-start">
                    <Text className="text-error text-xs font-semibold">URGENT</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}
