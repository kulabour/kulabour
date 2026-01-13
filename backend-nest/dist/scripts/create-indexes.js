"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
async function createIndexes() {
    await mongoose_1.default.connect('mongodb://localhost:27017/instant-labor');
    console.log('📊 Creating database indexes...\n');
    const db = mongoose_1.default.connection.db;
    if (!db) {
        throw new Error('Database connection failed');
    }
    console.log('Creating Bookings indexes...');
    await db.collection('bookings').createIndex({ customerId: 1, status: 1, createdAt: -1 });
    await db.collection('bookings').createIndex({ workerId: 1, scheduledTime: 1 });
    await db.collection('bookings').createIndex({ 'payment.status': 1, createdAt: -1 });
    await db.collection('bookings').createIndex({ status: 1, scheduledTime: 1 });
    console.log('✅ Bookings indexes created');
    console.log('\nCreating Services indexes...');
    await db.collection('services').createIndex({ name: 'text', description: 'text', tags: 'text' });
    await db.collection('services').createIndex({ isActive: 1, category: 1 });
    console.log('✅ Services indexes created');
    console.log('\nCreating Users indexes...');
    await db.collection('users').createIndex({ mobile: 1 }, { unique: true });
    await db.collection('users').createIndex({ userType: 1, isVerified: 1 });
    await db.collection('users').createIndex({ location: '2dsphere' });
    console.log('✅ Users indexes created');
    console.log('\n📋 Verifying indexes:\n');
    const bookingIndexes = await db.collection('bookings').indexes();
    console.log('Bookings:', bookingIndexes.length, 'indexes');
    const serviceIndexes = await db.collection('services').indexes();
    console.log('Services:', serviceIndexes.length, 'indexes');
    const userIndexes = await db.collection('users').indexes();
    console.log('Users:', userIndexes.length, 'indexes');
    await mongoose_1.default.disconnect();
    console.log('\n✅ All indexes created successfully!');
}
createIndexes().catch(console.error);
//# sourceMappingURL=create-indexes.js.map