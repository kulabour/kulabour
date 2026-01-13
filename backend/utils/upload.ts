import AWS from 'aws-sdk';
import multer, { FileFilterCallback } from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import logger from './logger';

// Initialize S3 (with placeholder - add your keys)
let s3Initialized = false;
let s3: AWS.S3 | null = null;

try {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'ap-south-1'
        });
        s3Initialized = true;
        logger.info('✅ AWS S3 initialized');
    } else {
        logger.warn('⚠️  AWS S3 not configured. Set AWS_ACCESS_KEY_ID in .env');
    }
} catch (error: any) {
    logger.warn({ data: error.message }, '⚠️  AWS S3 initialization failed:');
}

// Local storage fallback
const localStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        // Ensure uploads directory exists
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// S3 storage
const s3Storage = s3Initialized && s3 ? multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || 'kulabour-uploads',
    acl: 'public-read',
    metadata: (req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
}) : undefined; // Use undefined instead of null to match union type if strict

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images allowed!'));
    }
};

// Upload middleware
export const upload = multer({
    storage: s3Initialized ? s3Storage : localStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

export const isS3 = s3Initialized;


