"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
const User = mongoose_1.default.model('User', userSchema);
async function seedGeoData() {
    await mongoose_1.default.connect('mongodb://localhost:27017/instant-labor');
    console.log('🌱 Seeding geospatial test data...');
    const testWorkers = [
        {
            mobile: '9999000001',
            name: 'Worker 1 - Connaught Place',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.2167, 28.6328]
            }
        },
        {
            mobile: '9999000002',
            name: 'Worker 2 - India Gate',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.2295, 28.6129]
            }
        },
        {
            mobile: '9999000003',
            name: 'Worker 3 - Karol Bagh',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.1907, 28.6519]
            }
        },
        {
            mobile: '9999000004',
            name: 'Worker 4 - Dwarka (Far)',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.0469, 28.5921]
            }
        },
        {
            mobile: '9999000005',
            name: 'Worker 5 - Nehru Place',
            userType: 'worker',
            isVerified: true,
            location: {
                type: 'Point',
                coordinates: [77.2502, 28.5494]
            }
        },
    ];
    await User.deleteMany({ mobile: { $in: testWorkers.map(w => w.mobile) } });
    await User.insertMany(testWorkers);
    console.log(`✅ Seeded ${testWorkers.length} test workers with geolocation data`);
    console.log('\n🔍 Testing geospatial query (5km radius from center)...');
    const nearbyWorkers = await User.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [77.2090, 28.6139]
                },
                $maxDistance: 5000
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
    await mongoose_1.default.disconnect();
    console.log('\n✅ Done!');
}
seedGeoData().catch(console.error);
//# sourceMappingURL=seed-geo-data.js.map