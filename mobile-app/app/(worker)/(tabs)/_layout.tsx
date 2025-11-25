import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function WorkerTabsLayout() {
    return (
        <Tabs screenOptions={{ tabBarActiveTintColor: '#2563EB' }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Jobs',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="earnings"
                options={{
                    title: 'Earnings',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💰</Text>,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
                }}
            />
        </Tabs>
    );
}
