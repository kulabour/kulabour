import express, { Request, Response } from 'express';
import Service from '../models/Service';
import { cacheMiddleware, invalidateCache } from '../middleware/cache';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Get all services (cached for 24 hours)
router.get('/', cacheMiddleware(86400), asyncHandler(async (req: Request, res: Response) => {
    // Try to get from database first
    let services = await Service.find({ isActive: true }).lean();

    // If no services in DB, return hardcoded data
    if (services.length === 0) {
        services = [
            { name: 'Cleaning', workers: '234', avgPrice: '₹299', icon: '🧹', isActive: true } as any,
            { name: 'Plumbing', workers: '156', avgPrice: '₹449', icon: '🔧', isActive: true } as any,
            { name: 'Electrical', workers: '189', avgPrice: '₹549', icon: '⚡', isActive: true } as any,
            { name: 'Painting', workers: '98', avgPrice: '₹899', icon: '🎨', isActive: true } as any,
            { name: 'Carpentry', workers: '67', avgPrice: '₹699', icon: '🔨', isActive: true } as any,
            { name: 'Appliance', workers: '123', avgPrice: '₹599', icon: '🧊', isActive: true } as any,
        ];
    }

    res.json({ success: true, data: services });
}));

// Create service (admin only, invalidates cache)
router.post('/',
    authenticate,
    authorize('admin'),
    invalidateCache('cache:/api/services*'),
    asyncHandler(async (req: Request, res: Response) => {
        const service = await Service.create(req.body);
        res.status(201).json({ success: true, data: service });
    })
);

// Update service (admin only, invalidates cache)
router.put('/:id',
    authenticate,
    authorize('admin'),
    invalidateCache('cache:/api/services*'),
    asyncHandler(async (req: Request, res: Response) => {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        res.json({ success: true, data: service });
    })
);

export default router;
