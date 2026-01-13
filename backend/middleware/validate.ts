import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Extend Express Request interface to include validated data
declare global {
    namespace Express {
        interface Request {
            validatedBody?: any;
            validatedQuery?: any;
            validatedParams?: any;
        }
    }
}

/**
 * Validation middleware for request body validation using Joi
 */
export const validate = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first
            stripUnknown: true, // Remove unknown fields
            convert: true // Convert types (e.g., string to number)
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/["]/g, '') // Remove quotes from messages
            }));

            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        // Replace req.body with validated (and sanitized) data
        req.validatedBody = value;
        next();
    };
};

/**
 * Validate query parameters
 */
export const validateQuery = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/["]/g, '')
            }));

            return res.status(400).json({
                error: 'Invalid query parameters',
                details: errors
            });
        }

        req.validatedQuery = value;
        next();
    };
};

/**
 * Validate URL parameters
 */
export const validateParams = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            stripUnknown: true,
            convert: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/["]/g, '')
            }));

            return res.status(400).json({
                error: 'Invalid URL parameters',
                details: errors
            });
        }

        req.validatedParams = value;
        next();
    };
};
