import express, { Request, Response } from 'express';
import { authenticate } from '../middleware/auth';
import { upload, isS3 } from '../utils/upload';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Upload single image
router.post('/', authenticate, upload.single('image'), asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Construct URL
    let fileUrl;
    if (isS3) {
        // @ts-ignore - location property exists on Multer S3 file object
        fileUrl = req.file.location;
    } else {
        // Local URL
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
    }

    res.json({
        success: true,
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype
    });
}));

export default router;
