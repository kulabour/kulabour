"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const upload_1 = require("../utils/upload");
const errorHandler_1 = require("../middleware/errorHandler");
const router = express_1.default.Router();
// Upload single image
router.post('/', auth_1.authenticate, upload_1.upload.single('image'), (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Construct URL
    let fileUrl;
    if (upload_1.isS3) {
        // @ts-ignore - location property exists on Multer S3 file object
        fileUrl = req.file.location;
    }
    else {
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
exports.default = router;
