/**
 * KULABOUR - Offline Queue Service
 * Manages pending API requests when device is offline
 * Automatically retries when network is restored
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { apiClient } from './api/client';

// Types
export interface QueuedRequest {
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endpoint: string;
    data?: any;
    headers?: Record<string, string>;
    priority: 'critical' | 'high' | 'normal' | 'low';
    createdAt: number;
    retryCount: number;
    maxRetries: number;
    lastError?: string;
}

export interface QueueStatus {
    isOnline: boolean;
    pendingCount: number;
    isSyncing: boolean;
    lastSyncAt: number | null;
    failedCount: number;
}

type StatusCallback = (status: QueueStatus) => void;

const QUEUE_STORAGE_KEY = '@kulabour_offline_queue';
const MAX_RETRIES = 5;
const RETRY_DELAYS = [1000, 2000, 5000, 10000, 30000]; // Exponential backoff

class OfflineQueueService {
    private queue: QueuedRequest[] = [];
    private isOnline: boolean = true;
    private isSyncing: boolean = false;
    private lastSyncAt: number | null = null;
    private statusListeners: Set<StatusCallback> = new Set();
    private unsubscribeNetInfo: (() => void) | null = null;

    constructor() {
        this.initialize();
    }

    /**
     * Initialize the service
     */
    private async initialize() {
        // Load persisted queue
        await this.loadQueue();

        // Monitor network status
        this.unsubscribeNetInfo = NetInfo.addEventListener(this.handleNetworkChange);

        // Check initial network status
        const state = await NetInfo.fetch();
        this.isOnline = state.isConnected ?? false;

        // Process queue if online
        if (this.isOnline && this.queue.length > 0) {
            this.processQueue();
        }
    }

    /**
     * Handle network status changes
     */
    private handleNetworkChange = (state: NetInfoState) => {
        const wasOffline = !this.isOnline;
        this.isOnline = state.isConnected ?? false;

        console.log(`[OfflineQueue] Network status: ${this.isOnline ? 'Online' : 'Offline'}`);
        this.notifyStatusListeners();

        // Process queue when coming back online
        if (wasOffline && this.isOnline && this.queue.length > 0) {
            console.log('[OfflineQueue] Back online, processing queue...');
            this.processQueue();
        }
    };

    /**
     * Add a request to the queue
     */
    async enqueue(
        method: QueuedRequest['method'],
        endpoint: string,
        data?: any,
        priority: QueuedRequest['priority'] = 'normal'
    ): Promise<string> {
        const request: QueuedRequest = {
            id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            method,
            endpoint,
            data,
            priority,
            createdAt: Date.now(),
            retryCount: 0,
            maxRetries: MAX_RETRIES,
        };

        // Insert based on priority
        const priorityOrder = { critical: 0, high: 1, normal: 2, low: 3 };
        const insertIndex = this.queue.findIndex(
            q => priorityOrder[q.priority] > priorityOrder[priority]
        );

        if (insertIndex === -1) {
            this.queue.push(request);
        } else {
            this.queue.splice(insertIndex, 0, request);
        }

        await this.saveQueue();
        this.notifyStatusListeners();

        console.log(`[OfflineQueue] Enqueued request: ${request.id} (${method} ${endpoint})`);

        // Try to process immediately if online
        if (this.isOnline && !this.isSyncing) {
            this.processQueue();
        }

        return request.id;
    }

    /**
     * Process pending requests in the queue
     */
    private async processQueue() {
        if (this.isSyncing || !this.isOnline || this.queue.length === 0) {
            return;
        }

        this.isSyncing = true;
        this.notifyStatusListeners();

        console.log(`[OfflineQueue] Processing ${this.queue.length} pending requests...`);

        const processedIds: string[] = [];
        const failedRequests: QueuedRequest[] = [];

        for (const request of [...this.queue]) {
            if (!this.isOnline) {
                console.log('[OfflineQueue] Network lost, pausing queue processing');
                break;
            }

            try {
                await this.executeRequest(request);
                processedIds.push(request.id);
                console.log(`[OfflineQueue] Successfully processed: ${request.id}`);
            } catch (error: any) {
                console.error(`[OfflineQueue] Failed to process: ${request.id}`, error.message);

                request.retryCount++;
                request.lastError = error.message;

                if (request.retryCount < request.maxRetries) {
                    // Schedule retry with exponential backoff
                    const delay = RETRY_DELAYS[Math.min(request.retryCount - 1, RETRY_DELAYS.length - 1)];
                    setTimeout(() => this.processQueue(), delay);
                    failedRequests.push(request);
                } else {
                    console.log(`[OfflineQueue] Max retries reached for: ${request.id}`);
                    // Keep in failed state for manual review
                    failedRequests.push({ ...request, priority: 'low' });
                }
            }
        }

        // Remove processed requests
        this.queue = this.queue.filter(r => !processedIds.includes(r.id));

        // Update failed requests
        for (const failed of failedRequests) {
            const index = this.queue.findIndex(r => r.id === failed.id);
            if (index !== -1) {
                this.queue[index] = failed;
            }
        }

        await this.saveQueue();

        this.isSyncing = false;
        this.lastSyncAt = Date.now();
        this.notifyStatusListeners();

        console.log(`[OfflineQueue] Processing complete. ${processedIds.length} succeeded, ${failedRequests.length} failed.`);
    }

    /**
     * Execute a single request
     */
    private async executeRequest(request: QueuedRequest): Promise<any> {
        switch (request.method) {
            case 'GET':
                return apiClient.get(request.endpoint);
            case 'POST':
                return apiClient.post(request.endpoint, request.data);
            case 'PUT':
                return apiClient.put(request.endpoint, request.data);
            case 'DELETE':
                return apiClient.delete(request.endpoint);
            case 'PATCH':
                return apiClient.patch(request.endpoint, request.data);
            default:
                throw new Error(`Unsupported method: ${request.method}`);
        }
    }

    /**
     * Get current queue status
     */
    getStatus(): QueueStatus {
        return {
            isOnline: this.isOnline,
            pendingCount: this.queue.length,
            isSyncing: this.isSyncing,
            lastSyncAt: this.lastSyncAt,
            failedCount: this.queue.filter(r => r.retryCount >= r.maxRetries).length,
        };
    }

    /**
     * Get all pending requests
     */
    getPendingRequests(): QueuedRequest[] {
        return [...this.queue];
    }

    /**
     * Remove a specific request from queue
     */
    async removeRequest(id: string): Promise<boolean> {
        const index = this.queue.findIndex(r => r.id === id);
        if (index !== -1) {
            this.queue.splice(index, 1);
            await this.saveQueue();
            this.notifyStatusListeners();
            return true;
        }
        return false;
    }

    /**
     * Retry a specific failed request
     */
    async retryRequest(id: string): Promise<boolean> {
        const request = this.queue.find(r => r.id === id);
        if (request) {
            request.retryCount = 0;
            request.priority = 'high';
            await this.saveQueue();
            this.processQueue();
            return true;
        }
        return false;
    }

    /**
     * Clear all failed requests
     */
    async clearFailedRequests(): Promise<number> {
        const failedCount = this.queue.filter(r => r.retryCount >= r.maxRetries).length;
        this.queue = this.queue.filter(r => r.retryCount < r.maxRetries);
        await this.saveQueue();
        this.notifyStatusListeners();
        return failedCount;
    }

    /**
     * Force sync the queue
     */
    async forceSync(): Promise<void> {
        if (this.isOnline) {
            await this.processQueue();
        }
    }

    /**
     * Register a status listener
     */
    onStatusChange(callback: StatusCallback): () => void {
        this.statusListeners.add(callback);
        // Immediately notify with current status
        callback(this.getStatus());
        return () => this.statusListeners.delete(callback);
    }

    /**
     * Notify all status listeners
     */
    private notifyStatusListeners() {
        const status = this.getStatus();
        this.statusListeners.forEach(cb => cb(status));
    }

    /**
     * Persist queue to storage
     */
    private async saveQueue(): Promise<void> {
        try {
            await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
        } catch (error) {
            console.error('[OfflineQueue] Failed to save queue:', error);
        }
    }

    /**
     * Load queue from storage
     */
    private async loadQueue(): Promise<void> {
        try {
            const stored = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
            if (stored) {
                this.queue = JSON.parse(stored);
                console.log(`[OfflineQueue] Loaded ${this.queue.length} pending requests`);
            }
        } catch (error) {
            console.error('[OfflineQueue] Failed to load queue:', error);
        }
    }

    /**
     * Cleanup on app close
     */
    destroy() {
        if (this.unsubscribeNetInfo) {
            this.unsubscribeNetInfo();
        }
    }
}

// Export singleton instance
export const offlineQueue = new OfflineQueueService();
export default OfflineQueueService;
