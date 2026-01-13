import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { schema } from './schema';
import Service from './model/Service';
import Booking from './model/Booking';
// import Worker from './model/Worker'; // To be implemented

const adapter = new SQLiteAdapter({
    schema,
    // (You might want to comment out migrations if you're not using them yet)
    // migrations,
    dbName: 'kulabour_offline_db', // optional, default: 'watermelon'
    // jsi: true, // Enable if using native modules for faster DB interaction (requires native build)
    onSetUpError: error => {
        // Database failed to load -- likely need to clear it or log error
        console.error('Database setup failed:', error);
    },
});

export const database = new Database({
    adapter,
    modelClasses: [
        Service,
        Booking,
        // Worker,
    ],
});

// Export helper to reset DB (dev only)
export async function resetDatabase() {
    // @ts-expect-error - Legacy API, signature changed in newer versions
    await adapter.unsafeResetDatabase();
}
