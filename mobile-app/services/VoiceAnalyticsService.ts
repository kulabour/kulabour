/**
 * Voice Analytics Service for KULABOUR
 * Tracks STT accuracy, TTS usage, and conversation patterns
 * Critical for identifying voice assistant improvement areas
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface VoiceEvent {
    type: 'stt_start' | 'stt_success' | 'stt_error' | 'tts_start' | 'tts_skip' | 'quick_action' | 'text_fallback';
    timestamp: string;
    language?: string;
    transcript?: string;
    duration?: number;
    error?: string;
    metadata?: Record<string, any>;
}

interface VoiceAnalytics {
    sessionId: string;
    startTime: string;
    events: VoiceEvent[];
    summary: {
        sttAttempts: number;
        sttSuccesses: number;
        sttErrors: number;
        ttsPlayed: number;
        ttsSkipped: number;
        quickActions: number;
        textFallbacks: number;
    };
}

const ANALYTICS_KEY = '@kulabour_voice_analytics';
const MAX_SESSIONS = 50;

class VoiceAnalyticsService {
    private currentSession: VoiceAnalytics | null = null;
    private sessions: VoiceAnalytics[] = [];

    constructor() {
        this.loadSessions();
    }

    /**
     * Start a new analytics session
     */
    startSession(): string {
        const sessionId = `voice_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

        this.currentSession = {
            sessionId,
            startTime: new Date().toISOString(),
            events: [],
            summary: {
                sttAttempts: 0,
                sttSuccesses: 0,
                sttErrors: 0,
                ttsPlayed: 0,
                ttsSkipped: 0,
                quickActions: 0,
                textFallbacks: 0,
            },
        };

        console.log(`📊 Voice analytics session started: ${sessionId}`);
        return sessionId;
    }

    /**
     * Track STT start event
     */
    trackSTTStart(language: string = 'hi-IN') {
        if (!this.currentSession) this.startSession();

        this.currentSession!.summary.sttAttempts++;
        this.addEvent({
            type: 'stt_start',
            timestamp: new Date().toISOString(),
            language,
        });
    }

    /**
     * Track STT success
     */
    trackSTTSuccess(transcript: string, duration: number, language: string = 'hi-IN') {
        if (!this.currentSession) return;

        this.currentSession.summary.sttSuccesses++;
        this.addEvent({
            type: 'stt_success',
            timestamp: new Date().toISOString(),
            transcript,
            duration,
            language,
        });
    }

    /**
     * Track STT error
     */
    trackSTTError(error: string, language: string = 'hi-IN') {
        if (!this.currentSession) return;

        this.currentSession.summary.sttErrors++;
        this.addEvent({
            type: 'stt_error',
            timestamp: new Date().toISOString(),
            error,
            language,
        });
    }

    /**
     * Track TTS played
     */
    trackTTSPlayed(language: string = 'hi-IN') {
        if (!this.currentSession) return;

        this.currentSession.summary.ttsPlayed++;
        this.addEvent({
            type: 'tts_start',
            timestamp: new Date().toISOString(),
            language,
        });
    }

    /**
     * Track TTS skipped (no Hindi voice available)
     */
    trackTTSSkipped(reason: string = 'no_hindi_voice') {
        if (!this.currentSession) return;

        this.currentSession.summary.ttsSkipped++;
        this.addEvent({
            type: 'tts_skip',
            timestamp: new Date().toISOString(),
            metadata: { reason },
        });
    }

    /**
     * Track quick action usage
     */
    trackQuickAction(actionLabel: string, query: string) {
        if (!this.currentSession) this.startSession();

        this.currentSession!.summary.quickActions++;
        this.addEvent({
            type: 'quick_action',
            timestamp: new Date().toISOString(),
            metadata: { actionLabel, query },
        });
    }

    /**
     * Track text fallback usage
     */
    trackTextFallback(text: string) {
        if (!this.currentSession) this.startSession();

        this.currentSession!.summary.textFallbacks++;
        this.addEvent({
            type: 'text_fallback',
            timestamp: new Date().toISOString(),
            transcript: text,
        });
    }

    /**
     * End current session and persist
     */
    async endSession() {
        if (!this.currentSession) return;

        this.sessions.push(this.currentSession);

        // Keep only recent sessions
        if (this.sessions.length > MAX_SESSIONS) {
            this.sessions = this.sessions.slice(-MAX_SESSIONS);
        }

        await this.saveSessions();

        console.log(`📊 Voice session ended. STT: ${this.currentSession.summary.sttSuccesses}/${this.currentSession.summary.sttAttempts} success`);
        this.currentSession = null;
    }

    /**
     * Get overall analytics summary
     */
    getOverallStats() {
        const totals = {
            totalSessions: this.sessions.length,
            sttAttempts: 0,
            sttSuccesses: 0,
            sttErrors: 0,
            ttsPlayed: 0,
            ttsSkipped: 0,
            quickActions: 0,
            textFallbacks: 0,
        };

        for (const session of this.sessions) {
            totals.sttAttempts += session.summary.sttAttempts;
            totals.sttSuccesses += session.summary.sttSuccesses;
            totals.sttErrors += session.summary.sttErrors;
            totals.ttsPlayed += session.summary.ttsPlayed;
            totals.ttsSkipped += session.summary.ttsSkipped;
            totals.quickActions += session.summary.quickActions;
            totals.textFallbacks += session.summary.textFallbacks;
        }

        return {
            ...totals,
            sttSuccessRate: totals.sttAttempts > 0
                ? Math.round((totals.sttSuccesses / totals.sttAttempts) * 100)
                : 0,
            ttsSkipRate: (totals.ttsPlayed + totals.ttsSkipped) > 0
                ? Math.round((totals.ttsSkipped / (totals.ttsPlayed + totals.ttsSkipped)) * 100)
                : 0,
            voiceVsTextRatio: (totals.sttSuccesses + totals.quickActions + totals.textFallbacks) > 0
                ? Math.round(((totals.sttSuccesses + totals.quickActions) / (totals.sttSuccesses + totals.quickActions + totals.textFallbacks)) * 100)
                : 0,
        };
    }

    /**
     * Add event to current session
     */
    private addEvent(event: VoiceEvent) {
        if (this.currentSession) {
            this.currentSession.events.push(event);
        }
    }

    /**
     * Persist sessions to AsyncStorage
     */
    private async saveSessions() {
        try {
            await AsyncStorage.setItem(ANALYTICS_KEY, JSON.stringify(this.sessions));
        } catch (error) {
            console.error('Failed to save voice analytics:', error);
        }
    }

    /**
     * Load sessions from AsyncStorage
     */
    private async loadSessions() {
        try {
            const stored = await AsyncStorage.getItem(ANALYTICS_KEY);
            if (stored) {
                this.sessions = JSON.parse(stored);
                console.log(`📊 Loaded ${this.sessions.length} voice analytics sessions`);
            }
        } catch (error) {
            console.error('Failed to load voice analytics:', error);
        }
    }

    /**
     * Clear all analytics data
     */
    async clearAnalytics() {
        this.sessions = [];
        this.currentSession = null;
        await AsyncStorage.removeItem(ANALYTICS_KEY);
        console.log('📊 Voice analytics cleared');
    }
}

// Export singleton
export const voiceAnalytics = new VoiceAnalyticsService();
export default VoiceAnalyticsService;
