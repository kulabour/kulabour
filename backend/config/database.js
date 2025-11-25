const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/instant-labor';

        await mongoose.connect(MONGODB_URI);

        console.log('✅ MongoDB Connected Successfully');
        console.log(`📍 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        // Don't exit process in development - continue with in-memory if DB unavailable
        console.warn('⚠️  Continuing without database connection');
    }
};

module.exports = connectDB;
