/**
 * KULABOUR App Startup Orchestrator
 * Automatically initializes all services in correct order
 * Handles errors gracefully without user intervention
 */

import { featureFlags } from './FeatureFlagService';
import { smartOnboarding } from './SmartOnboardingService';
import { voiceMonitoring } from './VoiceMonitoringService';
import { offlineQueue } from './OfflineQueueService';
import { logger } from './ProductionLogger';

interface StartupResult {
    success: boolean;
    servicesInitialized: string[];
    errors: string[];
    duration: number;
}

class AppStartupOrchestrator {
    private initialized = false;
    private startupResult: StartupResult | null = null;

    /**
     * Initialize all app services automatically
     * Called once on app start
     */
    async initializeApp(): Promise<StartupResult> {
        if (this.initialized && this.startupResult) {
            return this.startupResult;
        }

        const startTime = Date.now();
        const servicesInitialized: string[] = [];
        const errors: string[] = [];

        // 1. Initialize feature flags (critical)
        try {
            await featureFlags.init();
            servicesInitialized.push('FeatureFlags');
            logger.info('Startup', 'Feature flags initialized');
        } catch (error: any) {
            errors.push(`FeatureFlags: ${error.message}`);
            logger.error('Startup', 'Feature flags failed', error);
        }

        // 2. Initialize smart onboarding
        try {
            await smartOnboarding.init();
            servicesInitialized.push('SmartOnboarding');
            logger.info('Startup', 'Smart onboarding initialized');
        } catch (error: any) {
            errors.push(`SmartOnboarding: ${error.message}`);
            logger.error('Startup', 'Smart onboarding failed', error);
        }

        // 3. Initialize offline queue
        try {
            // OfflineQueue initializes automatically via constructor
            servicesInitialized.push('OfflineQueue');
            logger.info('Startup', 'Offline queue ready');
        } catch (error: any) {
            errors.push(`OfflineQueue: ${error.message}`);
            logger.error('Startup', 'Offline queue failed', error);
        }

        // 4. Voice analytics - initialized when session starts
        servicesInitialized.push('VoiceAnalytics');

        // 5. Start voice monitoring (if voice feature enabled)
        if (featureFlags.isEnabled('ENABLE_VOICE_ASSISTANT_V2')) {
            try {
                voiceMonitoring.startMonitoring();
                servicesInitialized.push('VoiceMonitoring');
                logger.info('Startup', 'Voice monitoring started');
            } catch (error: any) {
                errors.push(`VoiceMonitoring: ${error.message}`);
                logger.error('Startup', 'Voice monitoring failed', error);
            }
        }

        this.initialized = true;
        this.startupResult = {
            success: errors.length === 0,
            servicesInitialized,
            errors,
            duration: Date.now() - startTime,
        };

        logger.info('Startup', `App initialized in ${this.startupResult.duration}ms`, {
            services: servicesInitialized.length,
            errors: errors.length,
        });

        return this.startupResult;
    }

    /**
     * Cleanup all services on app close
     */
    async cleanup(): Promise<void> {
        try {
            voiceMonitoring.stopMonitoring();
            await offlineQueue.forceSync();
            logger.info('Startup', 'App cleanup complete');
        } catch (error) {
            logger.error('Startup', 'Cleanup failed', error);
        }
    }

    /**
     * Get last startup result
     */
    getStartupResult(): StartupResult | null {
        return this.startupResult;
    }

    /**
     * Check if app is fully initialized
     */
    isInitialized(): boolean {
        return this.initialized;
    }

    /**
     * Force re-initialization (for recovery)
     */
    async reinitialize(): Promise<StartupResult> {
        this.initialized = false;
        this.startupResult = null;
        return this.initializeApp();
    }
}

// Export singleton
export const appStartup = new AppStartupOrchestrator();
export default AppStartupOrchestrator;
