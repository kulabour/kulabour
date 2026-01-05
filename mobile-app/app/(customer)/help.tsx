import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import VideoFeed from '../../components/help/VideoFeed';
import { videoHelpService, HelpVideo } from '../../services/VideoHelpService';
import { COLORS, SPACING, TYPOGRAPHY } from '../../components/design/DesignSystem';

export default function HelpScreen() {
    const router = useRouter();
    const [videos, setVideos] = useState<HelpVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    useEffect(() => {
        loadVideos();
    }, [activeCategory]);

    const loadVideos = async () => {
        setLoading(true);
        try {
            const data = await videoHelpService.getVideos(activeCategory);
            setVideos(data);
        } catch (error) {
            console.error('Failed to load help videos', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'booking', label: 'Booking' },
        { id: 'payment', label: 'Payment' },
        { id: 'safety', label: 'Safety' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help Center / मदद</Text>
                <View style={{ width: 40 }} />
            </View>

            {/* Category Tabs */}
            <View style={styles.tabsContainer}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        onPress={() => setActiveCategory(cat.id)}
                        style={[
                            styles.tab,
                            activeCategory === cat.id && styles.activeTab
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            activeCategory === cat.id && styles.activeTabText
                        ]}>
                            {cat.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <VideoFeed videos={videos} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.m,
        paddingVertical: SPACING.s,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: TYPOGRAPHY.h3,
        fontWeight: 'bold',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.m,
        paddingBottom: SPACING.m,
        gap: SPACING.s,
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#333',
    },
    activeTab: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        color: '#aaa',
        fontWeight: '600',
    },
    activeTabText: {
        color: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
