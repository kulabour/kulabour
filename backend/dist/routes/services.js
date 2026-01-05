"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Service_1 = __importDefault(require("../models/Service"));
const cache_1 = require("../middleware/cache");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
// Get all services (cached for 24 hours)
router.get('/', (0, cache_1.cacheMiddleware)(86400), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    // Try to get from database first
    let services = await Service_1.default.find({ isActive: true }).lean();
    // If no services in DB, return hardcoded data
    if (services.length === 0) {
        services = [
            { name: 'Cleaning', workers: '234', avgPrice: '₹299', icon: '🧹', isActive: true },
            { name: 'Plumbing', workers: '156', avgPrice: '₹449', icon: '🔧', isActive: true },
            { name: 'Electrical', workers: '189', avgPrice: '₹549', icon: '⚡', isActive: true },
            { name: 'Painting', workers: '98', avgPrice: '₹899', icon: '🎨', isActive: true },
            { name: 'Carpentry', workers: '67', avgPrice: '₹699', icon: '🔨', isActive: true },
            { name: 'Appliance', workers: '123', avgPrice: '₹599', icon: '🧊', isActive: true },
        ];
    }
    res.json({ success: true, data: services });
}));
// Create service (admin only, invalidates cache)
router.post('/', auth_1.authenticate, (0, auth_1.authorize)('admin'), (0, cache_1.invalidateCache)('cache:/api/services*'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = await Service_1.default.create(req.body);
    res.status(201).json({ success: true, data: service });
}));
// Update service (admin only, invalidates cache)
router.put('/:id', auth_1.authenticate, (0, auth_1.authorize)('admin'), (0, cache_1.invalidateCache)('cache:/api/services*'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const service = await Service_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) {
        return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ success: true, data: service });
}));
exports.default = router;
