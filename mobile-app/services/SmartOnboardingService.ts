/**
 * KULABOUR Smart Onboarding Service
 * Auto-detects first-time users and guides them through features
 * Hindi-first, with auto-language detection
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
    hasSeenWelcome: boolean;
    hasSeenVoiceTutorial: boolean;
    hasCompletedFirstBooking: boolean;
    hasUsedVoiceFeature: boolean;
    preferredLanguage: 'hi' | 'en' | null;
    signupDate: string | null;
}

const DEFAULT_STATE: OnboardingState = {
    hasSeenWelcome: false,
    hasSeenVoiceTutorial: false,
    hasCompletedFirstBooking: false,
    hasUsedVoiceFeature: false,
    preferredLanguage: null,
    signupDate: null,
};

const STORAGE_KEY = '@kulabour_onboarding';

class SmartOnboardingService {
    private state: OnboardingState = { ...DEFAULT_STATE };
    private initialized = false;
    private listeners: Array<(state: OnboardingState) => void> = [];

    /**
     * Initialize onboarding state
     */
    async init() {
        if (this.initialized) return;

        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.state = { ...DEFAULT_STATE, ...JSON.parse(stored) };
            } else {
                // First time user
                this.state = {
                    ...DEFAULT_STATE,
                    signupDate: new Date().toISOString(),
                };
            }
            this.initialized = true;
            this.notifyListeners();
        } catch (error) {
            console.error('[Onboarding] Init failed:', error);
        }
    }

    /**
     * Check if user is new (first 7 days)
     */
    isNewUser(): boolean {
        if (!this.state.signupDate) return true;

        const signupDate = new Date(this.state.signupDate);
        const daysSinceSignup = (Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceSignup < 7;
    }

    /**
     * Should show welcome screen
     */
    shouldShowWelcome(): boolean {
        return !this.state.hasSeenWelcome;
    }

    /**
     * Should show voice tutorial
     */
    shouldShowVoiceTutorial(): boolean {
        return !this.state.hasSeenVoiceTutorial && !this.state.hasUsedVoiceFeature;
    }

    /**
     * Should show booking help
     */
    shouldShowBookingHelp(): boolean {
        return !this.state.hasCompletedFirstBooking && this.isNewUser();
    }

    /**
     * Mark welcome as seen
     */
    async markWelcomeSeen() {
        this.state.hasSeenWelcome = true;
        await this.saveState();
    }

    /**
     * Mark voice tutorial as seen
     */
    async markVoiceTutorialSeen() {
        this.state.hasSeenVoiceTutorial = true;
        await this.saveState();
    }

    /**
     * Mark voice feature used
     */
    async markVoiceFeatureUsed() {
        this.state.hasUsedVoiceFeature = true;
        await this.saveState();
    }

    /**
     * Mark first booking completed
     */
    async markFirstBookingCompleted() {
        this.state.hasCompletedFirstBooking = true;
        await this.saveState();
    }

    /**
     * Set preferred language
     */
    async setPreferredLanguage(lang: 'hi' | 'en') {
        this.state.preferredLanguage = lang;
        await this.saveState();
    }

    /**
     * Get preferred language (auto-detect if not set)
     */
    getPreferredLanguage(): 'hi' | 'en' {
        // Default to Hindi for Indian construction workers
        return this.state.preferredLanguage || 'hi';
    }

    /**
     * Get onboarding progress percentage
     */
    getProgress(): number {
        let completed = 0;
        const total = 4;

        if (this.state.hasSeenWelcome) completed++;
        if (this.state.hasSeenVoiceTutorial) completed++;
        if (this.state.hasUsedVoiceFeature) completed++;
        if (this.state.hasCompletedFirstBooking) completed++;

        return Math.round((completed / total) * 100);
    }

    /**
     * Subscribe to state changes
     */
    onStateChange(listener: (state: OnboardingState) => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    /**
     * Get current state
     */
    getState(): OnboardingState {
        return { ...this.state };
    }

    /**
     * Reset onboarding (for testing)
     */
    async reset() {
        this.state = { ...DEFAULT_STATE };
        await AsyncStorage.removeItem(STORAGE_KEY);
        this.notifyListeners();
    }

    private async saveState() {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            this.notifyListeners();
        } catch (error) {
            console.error('[Onboarding] Save failed:', error);
        }
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Export singleton
export const smartOnboarding = new SmartOnboardingService();
export default SmartOnboardingService;
