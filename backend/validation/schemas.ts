import Joi from 'joi';

// Booking validation schemas
export const createBookingSchema = Joi.object({
    serviceId: Joi.number().integer().min(1).required()
        .messages({
            'number.base': 'Service ID must be a number',
            'number.min': 'Service ID must be at least 1',
            'any.required': 'Service ID is required'
        }),

    serviceName: Joi.string().min(2).max(100).required()
        .messages({
            'string.empty': 'Service name is required',
            'string.min': 'Service name must be at least 2 characters',
            'string.max': 'Service name cannot exceed 100 characters'
        }),

    customerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required()
        .messages({
            'string.pattern.base': 'Invalid customer ID format',
            'any.required': 'Customer ID is required'
        }),

    customerName: Joi.string().min(2).max(100).required(),

    workerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional()
        .allow(null, ''),

    workerName: Joi.string().min(2).max(100).optional()
        .allow(null, ''),

    address: Joi.string().min(10).max(500).required()
        .messages({
            'string.min': 'Address must be at least 10 characters',
            'string.max': 'Address cannot exceed 500 characters',
            'any.required': 'Address is required'
        }),

    scheduledTime: Joi.date().min('now').required()
        .messages({
            'date.min': 'Scheduled time must be in the future',
            'any.required': 'Scheduled time is required'
        }),

    addOns: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            price: Joi.number().min(0).required()
        })
    ).optional(),

    totalAmount: Joi.number().min(0).max(100000).required()
        .messages({
            'number.min': 'Amount must be at least 0',
            'number.max': 'Amount cannot exceed ₹1,00,000',
            'any.required': 'Total amount is required'
        }),

    status: Joi.string()
        .valid('pending', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled')
        .default('pending')
});

export const updateBookingSchema = Joi.object({
    workerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).optional(),
    workerName: Joi.string().min(2).max(100).optional(),

    status: Joi.string()
        .valid('pending', 'accepted', 'arriving', 'in_progress', 'completed', 'cancelled')
        .optional(),

    totalAmount: Joi.number().min(0).max(100000).optional(),

    addOns: Joi.array().items(
        Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
            price: Joi.number().min(0).required()
        })
    ).optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// User validation schemas
export const createUserSchema = Joi.object({
    phone: Joi.string()
        .pattern(/^(\+91)?[6-9]\d{9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please enter a valid Indian phone number',
            'any.required': 'Phone number is required'
        }),

    role: Joi.string()
        .valid('customer', 'worker', 'admin')
        .default('customer'),

    profile: Joi.object({
        name: Joi.string().min(2).max(100).required(),
        photo: Joi.string().uri().optional(),
        languages: Joi.array().items(Joi.string()).optional()
    }).required()
});

export const updateUserSchema = Joi.object({
    profile: Joi.object({
        name: Joi.string().min(2).max(100).optional(),
        photo: Joi.string().uri().optional(),
        languages: Joi.array().items(Joi.string()).optional(),
        address: Joi.object({
            street: Joi.string().optional(),
            city: Joi.string().optional(),
            state: Joi.string().optional(),
            pincode: Joi.string().pattern(/^\d{6}$/).optional()
        }).optional()
    }).optional(),

    workerProfile: Joi.object({
        skills: Joi.array().items(
            Joi.object({
                category: Joi.string().valid(
                    'mason', 'carpenter', 'plumber', 'electrician',
                    'painter', 'cleaner', 'steel_worker', 'tiler'
                ).required(),
                experience: Joi.number().min(0).max(50).required(),
                verified: Joi.boolean().default(false)
            })
        ).optional(),
        availability: Joi.string().valid('available', 'busy', 'offline').optional()
    }).optional()
}).min(1);

// Service validation schemas
export const createServiceSchema = Joi.object({
    category: Joi.string().required(),
    hindi: Joi.string().required(),
    english: Joi.string().required(),
    icon: Joi.string().optional(),
    imageUrl: Joi.string().uri().optional(),

    subcategories: Joi.array().items(
        Joi.object({
            id: Joi.string().required(),
            hindi: Joi.string().required(),
            english: Joi.string().required(),
            baseRate: Joi.number().min(0).required(),
            estimatedDuration: Joi.number().min(0).required(),
            description: Joi.string().optional()
        })
    ).optional(),

    pricing: Joi.object({
        min: Joi.number().min(0).required(),
        max: Joi.number().min(Joi.ref('min')).required(),
        unit: Joi.string().valid('hour', 'sqft', 'job').required()
    }).required()
});
