import { View, Text } from 'react-native';
import { Image } from 'expo-image';

type AvatarProps = {
    name: string;
    imageUrl?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    online?: boolean;
};

export default function Avatar({ name, imageUrl, size = 'md', online }: AvatarProps) {
    const sizes = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-20 h-20',
        xl: 'w-28 h-28',
    };

    const textSizes = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl',
        xl: 'text-4xl',
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase();
    };

    return (
        <View className="relative">
            {imageUrl ? (
                <Image
                    source={imageUrl}
                    className={`${sizes[size]} rounded-full`}
                    contentFit="cover"
                    transition={200}
                />
            ) : (
                <View className={`${sizes[size]} rounded-full bg-neon-blue/20 border-2 border-neon-blue items-center justify-center`}>
                    <Text className={`${textSizes[size]} font-bold text-neon-blue`}>
                        {getInitials(name)}
                    </Text>
                </View>
            )}
            {online !== undefined && (
                <View className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-dark-navy ${online ? 'bg-success' : 'bg-white/30'
                    }`} />
            )}
        </View>
    );
}
