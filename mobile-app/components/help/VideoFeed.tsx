import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { ResizeMode, Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { HelpVideo } from '../../services/VideoHelpService';
import { COLORS, TYPOGRAPHY, SPACING } from '../design/DesignSystem';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_HEIGHT = SCREEN_HEIGHT - 180; // Account for header/tabs

interface Props {
    videos: HelpVideo[];
}

export default function VideoFeed({ videos }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef<any>(null);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken<HelpVideo>[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }, []);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 80
    };

    const renderItem = ({ item, index }: { item: HelpVideo; index: number }) => {
        const isActive = index === activeIndex;

        return (
            <View style={styles.videoContainer}>
                <Video
                    source={{ uri: item.videoUrl }}
                    style={styles.video}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={isActive}
                    isLooping
                    isMuted={false}
                    useNativeControls
                />

                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.overlay}
                >
                    <View style={styles.textContainer}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>

                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionIconCircle}>
                                <Ionicons name="heart" size={28} color="#fff" />
                            </View>
                            <Text style={styles.actionText}>Like</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <View style={styles.actionIconCircle}>
                                <Ionicons name="share-social" size={28} color="#fff" />
                            </View>
                            <Text style={styles.actionText}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlashList
                ref={listRef}
                data={videos}
                renderItem={renderItem}
                // @ts-ignore
                estimatedItemSize={VIDEO_HEIGHT}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    videoContainer: {
        height: VIDEO_HEIGHT,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#111',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: SPACING.l,
        paddingBottom: SPACING.xl,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
        marginRight: SPACING.l,
    },
    categoryBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.s,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: SPACING.s,
    },
    categoryText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    title: {
        color: '#fff',
        fontSize: TYPOGRAPHY.h3,
        fontWeight: 'bold',
        marginBottom: SPACING.xs,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    description: {
        color: '#ddd',
        fontSize: TYPOGRAPHY.body,
    },
    actionsContainer: {
        alignItems: 'center',
        gap: SPACING.l,
    },
    actionButton: {
        alignItems: 'center',
    },
    actionIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    actionText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});
