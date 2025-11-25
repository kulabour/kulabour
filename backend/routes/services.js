const express = require('express');
const router = express.Router();
const Service = require('../models/Service');

// Get all services
router.get('/', async (req, res) => {
    try {
        // Try to get from database first
        let services = await Service.find({ isActive: true });

        // If no services in DB, return hardcoded data
        if (services.length === 0) {
            services = [
                { id: 1, name: 'Cleaning', workers: '234', avgPrice: '₹299', icon: '🧹' },
                { id: 2, name: 'Plumbing', workers: '156', avgPrice: '₹449', icon: '🔧' },
                { id: 3, name: 'Electrical', workers: '189', avgPrice: '₹549', icon: '⚡' },
                { id: 4, name: 'Painting', workers: '98', avgPrice: '₹899', icon: '🎨' },
                { id: 5, name: 'Carpentry', workers: '67', avgPrice: '₹699', icon: '🔨' },
                { id: 6, name: 'Appliance', workers: '123', avgPrice: '₹599', icon: '🧊' },
            ];
        }

        res.json({ success: true, data: services });
    } catch (error) {
        // Fallback to hardcoded if database fails
        const services = [
            { id: 1, name: 'Cleaning', workers: '234', avgPrice: '₹299', icon: '🧹' },
            { id: 2, name: 'Plumbing', workers: '156', avgPrice: '₹449', icon: '🔧' },
            { id: 3, name: 'Electrical', workers: '189', avgPrice: '₹549', icon: '⚡' },
            { id: 4, name: 'Painting', workers: '98', avgPrice: '₹899', icon: '🎨' },
            { id: 5, name: 'Carpentry', workers: '67', avgPrice: '₹699', icon: '🔨' },
            { id: 6, name: 'Appliance', workers: '123', avgPrice: '₹599', icon: '🧊' },
        ];
        res.json({ success: true, data: services });
    }
});

module.exports = router;
