// scripts/create-indexes.ts
// Run with: npx ts-node scripts/create-indexes.ts

import mongoose from 'mongoose';

async function createIndexes() {
    await mongoose.connect('mongodb://localhost:27017/instant-labor');

    console.log('📊 Creating database indexes...\n');

    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('Database connection failed');
    }

    // Bookings indexes
    console.log('Creating Bookings indexes...');
    await db.collection('bookings').createIndex({ customerId: 1, status: 1, createdAt: -1 });
    await db.collection('bookings').createIndex({ workerId: 1, scheduledTime: 1 });
    await db.collection('bookings').createIndex({ 'payment.status': 1, createdAt: -1 });
    await db.collection('bookings').createIndex({ status: 1, scheduledTime: 1 });
    console.log('✅ Bookings indexes created');

    // Services indexes
    console.log('\nCreating Services indexes...');
    await db.collection('services').createIndex({ name: 'text', description: 'text', tags: 'text' });
    await db.collection('services').createIndex({ isActive: 1, category: 1 });
    console.log('✅ Services indexes created');

    // Users indexes
    console.log('\nCreating Users indexes...');
    await db.collection('users').createIndex({ mobile: 1 }, { unique: true });
    await db.collection('users').createIndex({ userType: 1, isVerified: 1 });
    await db.collection('users').createIndex({ location: '2dsphere' });
    console.log('✅ Users indexes created');

    // List all indexes
    console.log('\n📋 Verifying indexes:\n');

    const bookingIndexes = await db.collection('bookings').indexes();
    console.log('Bookings:', bookingIndexes.length, 'indexes');

    const serviceIndexes = await db.collection('services').indexes();
    console.log('Services:', serviceIndexes.length, 'indexes');

    const userIndexes = await db.collection('users').indexes();
    console.log('Users:', userIndexes.length, 'indexes');

    await mongoose.disconnect();
    console.log('\n✅ All indexes created successfully!');
}

createIndexes().catch(console.error);
