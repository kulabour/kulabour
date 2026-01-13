/**
 * KULABOUR Feature Flag Service
 * 
 * Provides a mechanism to safely roll out features to users.
 * Supports:
 * - Simple Boolean Flags (On/Off)
 * - Percentage Rollout (e.g. 50% of users) - Mocked for now
 * - App Version Checks
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type FeatureFlag =
    | 'ENABLE_SMART_RECOMMENDATIONS'
    | 'ENABLE_VOICE_ASSISTANT_V2'
    | 'ENABLE_FLASH_LIST_CART'
    | 'ENABLE_NEW_PAYMENT_FLOW';

// Default values for flags
const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
    'ENABLE_SMART_RECOMMENDATIONS': true, // Newly added AI feature
    'ENABLE_VOICE_ASSISTANT_V2': true,    // Voice improvements
    'ENABLE_FLASH_LIST_CART': true,       // Performance optimization
    'ENABLE_NEW_PAYMENT_FLOW': false,     // Work in progress
};

class FeatureFlagService {
    private flags: Record<FeatureFlag, boolean> = { ...DEFAULT_FLAGS };
    private initialized = false;

    /**
     * Initialize the feature flag service.
     * In a real app, this would fetch from a remote config (Firebase Remote Config, LaunchDarkly, etc.)
     */
    async init() {
        if (this.initialized) return;

        try {
            // Simulate fetching remote config with a timeout
            // In PROD, we would fetch from API/Firebase here

            // For now, we just use defaults, or maybe override from local storage for dev testing
            const storedOverrides = await AsyncStorage.getItem('FEATURE_FLAG_OVERRIDES');
            if (storedOverrides) {
                const overrides = JSON.parse(storedOverrides);
                this.flags = { ...this.flags, ...overrides };
            }

            this.initialized = true;
            console.log('FeatureFlagService initialized:', this.flags);
        } catch (error) {
            console.warn('Failed to initialize feature flags:', error);
            // Fallback to defaults is automatic
        }
    }

    /**
     * Check if a feature is enabled.
     * @param flag The feature flag to check
     * @returns boolean
     */
    isEnabled(flag: FeatureFlag): boolean {
        return this.flags[flag] ?? false;
    }

    /**
     * Development only: Toggle a feature flag manually
     */
    async setOverride(flag: FeatureFlag, value: boolean) {
        this.flags[flag] = value;

        try {
            // Persist overrides for dev
            const currentOverrides = await AsyncStorage.getItem('FEATURE_FLAG_OVERRIDES');
            const parsed = currentOverrides ? JSON.parse(currentOverrides) : {};
            parsed[flag] = value;
            await AsyncStorage.setItem('FEATURE_FLAG_OVERRIDES', JSON.stringify(parsed));
        } catch (e) {
            console.warn('Failed to save flag override');
        }
    }

    /**
     * Get all flags (for debug menu)
     */
    getAllFlags() {
        return { ...this.flags };
    }
}

// Export singleton
export const featureFlags = new FeatureFlagService();
