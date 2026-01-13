// scripts/seed-geo-data.ts
// Run with: npx ts-node scripts/seed-geo-data.ts

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    mobile: String,
    name: String,
    userType: String,
    isVerified: Boolean,
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number]
    }
});

userSchema.index({ location: '2dsphere' });

const User = mongoose.model('User', userSchema);

async function seedGeoData() {
    await mongoose.connect('mongodb://localhost:27017/instant-labor');

    console.log('🌱 Seeding geospatial test data...');

    // Delhi coordinates (center: 28.6139, 77.2090)
    const testWorkers = [
        {
            mobile: '9999000001',
            name: 'Worker 1 - Connaught Place',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.2167, 28.6328] // ~2.5km from center
            }
        },
        {
            mobile: '9999000002',
            name: 'Worker 2 - India Gate',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.2295, 28.6129] // ~1.8km from center
            }
        },
        {
            mobile: '9999000003',
            name: 'Worker 3 - Karol Bagh',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.1907, 28.6519] // ~3.5km from center
            }
        },
        {
            mobile: '9999000004',
            name: 'Worker 4 - Dwarka (Far)',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.0469, 28.5921] // ~16km from center (outside 5km radius)
            }
        },
        {
            mobile: '9999000005',
            name: 'Worker 5 - Nehru Place',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.2502, 28.5494] // ~7km from center
            }
        },
    ];

    await User.deleteMany({ mobile: { $in: testWorkers.map(w => w.mobile) } });
    await User.insertMany(testWorkers);

    console.log(`✅ Seeded ${testWorkers.length} test workers with geolocation data`);

    // Test query
    console.log('\n🔍 Testing geospatial query (5km radius from center)...');
    const nearbyWorkers = await User.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6139] // Center of Delhi
                },
                $maxDistance: 5000 // 5km
            }
        },
        userType: 'worker',
        isVerified: true
    });

    console.log(`\n📍 Found ${nearbyWorkers.length} workers within 5km:`);
    nearbyWorkers.forEach((worker, idx) => {
        const coords = worker.location?.coordinates || [];
        console.log(`  ${idx + 1}. ${worker.name} at [${coords.join(', ')}]`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done!');
}

seedGeoData().catch(console.error);
