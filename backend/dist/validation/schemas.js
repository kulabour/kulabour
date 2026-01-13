"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceSchema = exports.updateUserSchema = exports.createUserSchema = exports.updateBookingSchema = exports.createBookingSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Booking validation schemas
exports.createBookingSchema = joi_1.default.object({
    serviceId: joi_1.default.number().integer().min(1).required()
        .messages({
        'number.base': 'Service ID must be a number',
        'number.min': 'Service ID must be at least 1',
        'any.required': 'Service ID is required'
    }),
    serviceName: joi_1.default.string().min(2).max(100).required()
        .messages({
        'string.empty': 'Service name is required',
        'string.min': 'Service name must be at least 2 characters',
        'string.max': 'Service name cannot exceed 100 characters'
    }),
    customerId: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).required()
        .messages({
        'string.pattern.base': 'Invalid customer ID format',
        'any.required': 'Customer ID is required'
    }),
    customerName: joi_1.default.string().min(2).max(100).required(),
    workerId: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
        .allow(null, ''),
    workerName: joi_1.default.string().min(2).max(100).optional()
        .allow(null, ''),
    address: joi_1.default.string().min(10).max(500).required()
        .messages({
        'string.min': 'Address must be at least 10 characters',
        'string.max': 'Address cannot exceed 500 characters',
        'any.required': 'Address is required'
    }),
    scheduledTime: joi_1.default.date().min('now').required()
        .messages({
        'date.min': 'Scheduled time must be in the future',
        'any.required': 'Scheduled time is required'
    }),
    addOns: joi_1.default.array().items(joi_1.default.object({
        id: joi_1.default.number().required(),
        name: joi_1.default.string().required(),
        price: joi_1.default.number().min(0).required()
    })).optional(),
    totalAmount: joi_1.default.number().min(0).max(100000).required()
        .messages({
        'number.min': 'Amount must be at least 0',
        'number.max': 'Amount cannot exceed ₹1,00,000',
        'any.required': 'Total amount is required'
    }),
    status: joi_1.default.string()
        .valid('pending', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled')
        .default('pending')
});
exports.updateBookingSchema = joi_1.default.object({
    workerId: joi_1.default.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    workerName: joi_1.default.string().min(2).max(100).optional(),
    status: joi_1.default.string()
        .valid('pending', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled')
        .optional(),
    totalAmount: joi_1.default.number().min(0).max(100000).optional(),
    addOns: joi_1.default.array().items(joi_1.default.object({
        id: joi_1.default.number().required(),
        name: joi_1.default.string().required(),
        price: joi_1.default.number().min(0).required()
    })).optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});
// User validation schemas
exports.createUserSchema = joi_1.default.object({
    phone: joi_1.default.string()
        .pattern(/^(\+91)?[6-9]\d{9}$/)
        .required()
        .messages({
        'string.pattern.base': 'Please enter a valid Indian phone number',
        'any.required': 'Phone number is required'
    }),
    role: joi_1.default.string()
        .valid('customer', 'worker', 'admin')
        .default('customer'),
    profile: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required(),
        photo: joi_1.default.string().uri().optional(),
        languages: joi_1.default.array().items(joi_1.default.string()).optional()
    }).required()
});
exports.updateUserSchema = joi_1.default.object({
    profile: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).optional(),
        photo: joi_1.default.string().uri().optional(),
        languages: joi_1.default.array().items(joi_1.default.string()).optional(),
        address: joi_1.default.object({
            street: joi_1.default.string().optional(),
            city: joi_1.default.string().optional(),
            state: joi_1.default.string().optional(),
            pincode: joi_1.default.string().pattern(/^\d{6}$/).optional()
        }).optional()
    }).optional(),
    workerProfile: joi_1.default.object({
        skills: joi_1.default.array().items(joi_1.default.object({
            category: joi_1.default.string().valid('mason', 'carpenter', 'plumber', 'electrician', 'painter', 'cleaner', 'steel_worker', 'tiler').required(),
            experience: joi_1.default.number().min(0).max(50).required(),
            verified: joi_1.default.boolean().default(false)
        })).optional(),
        availability: joi_1.default.string().valid('available', 'busy', 'offline').optional()
    }).optional()
}).min(1);
// Service validation schemas
exports.createServiceSchema = joi_1.default.object({
    category: joi_1.default.string().required(),
    hindi: joi_1.default.string().required(),
    english: joi_1.default.string().required(),
    icon: joi_1.default.string().optional(),
    imageUrl: joi_1.default.string().uri().optional(),
    subcategories: joi_1.default.array().items(joi_1.default.object({
        id: joi_1.default.string().required(),
        hindi: joi_1.default.string().required(),
        english: joi_1.default.string().required(),
        baseRate: joi_1.default.number().min(0).required(),
        estimatedDuration: joi_1.default.number().min(0).required(),
        description: joi_1.default.string().optional()
    })).optional(),
    pricing: joi_1.default.object({
        min: joi_1.default.number().min(0).required(),
        max: joi_1.default.number().min(joi_1.default.ref('min')).required(),
        unit: joi_1.default.string().valid('hour', 'sqft', 'job').required()
    }).required()
});
