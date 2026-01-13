"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isS3 = exports.upload = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = __importDefault(require("./logger"));
// Initialize S3 (with placeholder - add your keys)
let s3Initialized = false;
let s3 = null;
try {
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        s3 = new aws_sdk_1.default.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION || 'ap-south-1'
        });
        s3Initialized = true;
        logger_1.default.info('✅ AWS S3 initialized');
    }
    else {
        logger_1.default.warn('⚠️  AWS S3 not configured. Set AWS_ACCESS_KEY_ID in .env');
    }
}
catch (error) {
    logger_1.default.warn({ data: error.message }, '⚠️  AWS S3 initialization failed:');
}
// Local storage fallback
const localStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Ensure uploads directory exists
        const uploadDir = path_1.default.join(__dirname, '../uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
// S3 storage
const s3Storage = s3Initialized && s3 ? (0, multer_s3_1.default)({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || 'kulabour-uploads',
    acl: 'public-read',
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
}) : undefined; // Use undefined instead of null to match union type if strict
// File filter
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(new Error('Only images allowed!'));
    }
};
// Upload middleware
exports.upload = (0, multer_1.default)({
    storage: s3Initialized ? s3Storage : localStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});
exports.isS3 = s3Initialized;
