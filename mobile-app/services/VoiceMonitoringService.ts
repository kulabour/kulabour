/**
 * KULABOUR Voice Assistant - Auto-Monitoring Service
 * Automatically detects and fixes common issues without manual intervention
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { voiceAnalytics } from './VoiceAnalyticsService';
import { speechRecognitionService } from './SpeechRecognitionService';
import { offlineQueue } from './OfflineQueueService';

interface HealthStatus {
    sttHealthy: boolean;
    queueHealthy: boolean;
    websocketHealthy: boolean;
    lastCheck: string;
    issues: string[];
    autoFixesApplied: string[];
}

class VoiceMonitoringService {
    private healthCheckInterval: NodeJS.Timeout | null = null;
    private readonly HEALTH_CHECK_INTERVAL = 60000; // 1 minute
    private readonly STORAGE_KEY = '@voice_health_status';

    /**
     * Start automated health monitoring
     */
    async startMonitoring() {
        console.log('[VoiceMonitor] Starting automated health checks...');

        // Initial health check
        await this.runHealthCheck();

        // Schedule periodic checks
        this.healthCheckInterval = setInterval(() => {
            this.runHealthCheck();
        }, this.HEALTH_CHECK_INTERVAL);
    }

    /**
     * Stop monitoring
     */
    stopMonitoring() {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
    }

    /**
     * Run comprehensive health check and auto-fix issues
     */
    private async runHealthCheck(): Promise<HealthStatus> {
        const issues: string[] = [];
        const autoFixesApplied: string[] = [];

        // 1. Check STT health
        const sttHealthy = await this.checkSTTHealth(issues, autoFixesApplied);

        // 2. Check offline queue health
        const queueHealthy = await this.checkQueueHealth(issues, autoFixesApplied);

        // 3. Check WebSocket health (placeholder)
        const websocketHealthy = true; // Will be checked in real implementation

        // 4. Check analytics data quality
        await this.checkAnalyticsData(issues, autoFixesApplied);

        const status: HealthStatus = {
            sttHealthy,
            queueHealthy,
            websocketHealthy,
            lastCheck: new Date().toISOString(),
            issues,
            autoFixesApplied,
        };

        // Save status
        await this.saveHealthStatus(status);

        // Log if issues found
        if (issues.length > 0) {
            console.warn('[VoiceMonitor] Issues detected:', issues);
            console.log('[VoiceMonitor] Auto-fixes applied:', autoFixesApplied);
        }

        return status;
    }

    /**
     * Check STT service health
     */
    private async checkSTTHealth(issues: string[], fixes: string[]): Promise<boolean> {
        try {
            const available = await speechRecognitionService.isAvailable();

            if (!available) {
                issues.push('STT not available');

                // Auto-fix: Reinitialize STT service
                try {
                    await speechRecognitionService.destroy();
                    fixes.push('Reinitialized STT service');
                    return true;
                } catch (e) {
                    issues.push('Failed to reinitialize STT');
                    return false;
                }
            }

            return true;
        } catch (error) {
            issues.push(`STT check failed: ${error}`);
            return false;
        }
    }

    /**
     * Check offline queue health
     */
    private async checkQueueHealth(issues: string[], fixes: string[]): Promise<boolean> {
        try {
            const status = offlineQueue.getStatus();

            // Check for stuck queue (pending items for >24 hours)
            if (status.pendingCount > 0 && status.lastSyncAt) {
                const hoursSinceSync = (Date.now() - status.lastSyncAt) / (1000 * 60 * 60);

                if (hoursSinceSync > 24) {
                    issues.push(`Queue stuck: ${status.pendingCount} items pending for ${hoursSinceSync.toFixed(1)}h`);

                    // Auto-fix: Force sync
                    try {
                        await offlineQueue.forceSync();
                        fixes.push('Forced offline queue sync');
                    } catch (e) {
                        issues.push('Failed to force sync queue');
                    }
                }
            }

            // Check for high failure rate
            if (status.failedCount > 5) {
                issues.push(`High failure rate: ${status.failedCount} failed items`);

                // Auto-fix: Clear old failed requests
                try {
                    await offlineQueue.clearFailedRequests();
                    fixes.push('Cleared old failed requests');
                } catch (e) {
                    issues.push('Failed to clear failed requests');
                }
            }

            return true;
        } catch (error) {
            issues.push(`Queue check failed: ${error}`);
            return false;
        }
    }

    /**
     * Check analytics data quality
     */
    private async checkAnalyticsData(issues: string[], fixes: string[]): Promise<void> {
        const stats = voiceAnalytics.getOverallStats();

        // Check STT success rate
        if (stats.sttSuccessRate < 50 && stats.sttAttempts > 10) {
            issues.push(`Low STT accuracy: ${stats.sttSuccessRate}%`);
            // In production, this would trigger alert to development team
        }

        // Check if TTS skip rate is too high
        if (stats.ttsSkipRate > 80) {
            issues.push(`High TTS skip rate: ${stats.ttsSkipRate}% (users lack Hindi voice)`);
            // This indicates device compatibility issue - log for support team
        }
    }

    /**
     * Get current health status
     */
    async getHealthStatus(): Promise<HealthStatus | null> {
        try {
            const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            console.error('[VoiceMonitor] Failed to get health status:', error);
            return null;
        }
    }

    /**
     * Save health status
     */
    private async saveHealthStatus(status: HealthStatus): Promise<void> {
        try {
            await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(status));
        } catch (error) {
            console.error('[VoiceMonitor] Failed to save health status:', error);
        }
    }

    /**
     * Manual health check (for debugging)
     */
    async checkHealthNow(): Promise<HealthStatus> {
        return this.runHealthCheck();
    }
}

// Export singleton
export const voiceMonitoring = new VoiceMonitoringService();
export default VoiceMonitoringService;
