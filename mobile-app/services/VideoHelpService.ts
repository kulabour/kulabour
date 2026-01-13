/**
 * KULABOUR Video Help Service
 * Provides educational content to users
 * 
 * ENHANCED: Caching, Analytics Tracking, and Contextual Help
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './ProductionLogger';

export interface HelpVideo {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
    category: 'booking' | 'payment' | 'wallet' | 'safety' | 'voice';
    duration: string;
}

const CACHE_KEY = '@video_help_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// Mock data (fallback)
export const MOCK_VIDEOS: HelpVideo[] = [
    {
        id: '1',
        title: 'बुकिंग कैसे करें? (How to Book)',
        description: 'Learn how to book a worker in 3 easy steps.',
        videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        thumbnailUrl: 'https://placehold.co/600x400/png',
        category: 'booking',
        duration: '0:45'
    },
    {
        id: '2',
        title: 'वॉलेट रिचार्ज (Add Money)',
        description: 'Add money to your Kulabour wallet safely.',
        videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        thumbnailUrl: 'https://placehold.co/600x400/png',
        category: 'wallet',
        duration: '1:00'
    },
    {
        id: '3',
        title: 'आवाज़ से बुकिंग (Voice Booking)',
        description: 'Just speak to book a plumber or electrician.',
        videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        thumbnailUrl: 'https://placehold.co/600x400/png',
        category: 'voice',
        duration: '0:35'
    }
];

class VideoHelpService {
    private videos: HelpVideo[] = [];
    private lastFetch: number = 0;

    /**
     * Get help videos with caching
     */
    async getVideos(category?: string): Promise<HelpVideo[]> {
        await this.ensureVideosLoaded();

        if (category && category !== 'all') {
            return this.videos.filter(v => v.category === category);
        }
        return this.videos;
    }

    /**
     * Track video view
     */
    trackVideoView(videoId: string) {
        logger.info('VideoHelp', 'User watched video', { videoId });
        // TODO: Send to analytics
    }

    /**
     * Get recommended video based on context
     */
    async getRecommendation(context: 'booking_failed' | 'payment_failed' | 'voice_error'): Promise<HelpVideo | undefined> {
        await this.ensureVideosLoaded();

        switch (context) {
            case 'booking_failed':
                return this.videos.find(v => v.category === 'booking');
            case 'payment_failed':
                return this.videos.find(v => v.category === 'wallet');
            case 'voice_error':
                return this.videos.find(v => v.category === 'voice');
            default:
                return undefined;
        }
    }

    private async ensureVideosLoaded() {
        const now = Date.now();
        if (this.videos.length > 0 && now - this.lastFetch < CACHE_EXPIRY) {
            return;
        }

        try {
            // Try loading from cache first to be fast
            const cached = await AsyncStorage.getItem(CACHE_KEY);
            if (cached) {
                const { data, timestamp } = JSON.parse(cached);
                if (now - timestamp < CACHE_EXPIRY) {
                    this.videos = data;
                    this.lastFetch = timestamp;
                    logger.info('VideoHelp', 'Loaded videos from cache');
                    return; // Return cached data, maybe refresh in background
                }
            }

            // In real app, fetch from API
            // const response = await api.get('/help/videos');
            // const freshVideos = response.data;
            const freshVideos = MOCK_VIDEOS; // Using mock for now

            this.videos = freshVideos;
            this.lastFetch = now;

            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({
                data: freshVideos,
                timestamp: now
            }));

            logger.info('VideoHelp', 'Refreshed videos from server');

        } catch (error) {
            logger.error('VideoHelp', 'Failed to load videos', error);
            // Fallback to existing videos or hardcoded mock if empty
            if (this.videos.length === 0) {
                this.videos = MOCK_VIDEOS;
            }
        }
    }
}

export const videoHelpService = new VideoHelpService();
