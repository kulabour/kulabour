import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from './index';
import { apiClient } from '../services/api/client';

export async function syncDatabase() {
    console.log('🔄 Starting database synchronization...');

    try {
        await synchronize({
            database,
            pullChanges: async ({ lastPulledAt }): Promise<any> => {
                const timestamp = lastPulledAt || 0;
                console.log(`📥 Pulling changes since ${new Date(timestamp).toISOString()}`);

                const response = await apiClient.get(`/sync?last_pulled_at=${timestamp}`);

                if (!response.success) {
                    throw new Error(response.error?.message || 'Sync pull failed');
                }

                console.log('✅ Pulled changes successfully');
                return response.data;
            },

            pushChanges: async ({ changes, lastPulledAt }) => {
                console.log('📤 Pushing local changes to server...');

                const response = await apiClient.post('/sync', {
                    changes,
                    last_pulled_at: lastPulledAt,
                });

                if (!response.success) {
                    throw new Error(response.error?.message || 'Sync push failed');
                }

                console.log('✅ Pushed changes successfully');
            },
        });

        console.log('✅ Database sync completed');
        return true;
    } catch (error) {
        console.error('❌ Database sync failed:', error);
        return false;
    }
}

// Auto-sync every 60 seconds when online
let syncInterval: NodeJS.Timeout | null = null;

export function startAutoSync() {
    if (syncInterval) return;

    console.log('🔄 Starting auto-sync (every 60 seconds)');
    syncInterval = setInterval(() => {
        syncDatabase();
    }, 60000);
}

export function stopAutoSync() {
    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
        console.log('⏸️ Auto-sync stopped');
    }
}
