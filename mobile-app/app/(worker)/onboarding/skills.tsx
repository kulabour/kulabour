import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SkillsScreen() {
    const skills = [
        { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
        { id: 'electrical', name: 'Electrical', icon: '⚡' },
        { id: 'painting', name: 'Painting', icon: '🎨' },
        { id: 'carpentry', name: 'Carpentry', icon: '🪚' },
        { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
        { id: 'masonry', name: 'Masonry', icon: '🧱' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-white p-6">
            <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 mb-2">Your Skills</Text>
                <Text className="text-gray-500 mb-8">Select the work you can do</Text>

                <View className="flex-row flex-wrap gap-4">
                    {skills.map((skill) => (
                        <TouchableOpacity key={skill.id} className="w-[47%] bg-white border border-gray-200 rounded-xl p-4 items-center active:bg-blue-50 active:border-primary shadow-sm">
                            <Text className="text-3xl mb-2">{skill.icon}</Text>
                            <Text className="font-medium text-gray-900">{skill.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Link href="/(worker)/(tabs)" asChild>
                <TouchableOpacity className="bg-primary p-4 rounded-xl items-center">
                    <Text className="text-white font-bold text-base">Finish Setup</Text>
                </TouchableOpacity>
            </Link>
        </SafeAreaView>
    );
}
