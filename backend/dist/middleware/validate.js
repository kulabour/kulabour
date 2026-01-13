"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validate = void 0;
/**
 * Validation middleware for request body validation using Joi
 */
const validate = (schema) => {
    return (req, res, next) => {
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
exports.validate = validate;
/**
 * Validate query parameters
 */
const validateQuery = (schema) => {
    return (req, res, next) => {
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
exports.validateQuery = validateQuery;
/**
 * Validate URL parameters
 */
const validateParams = (schema) => {
    return (req, res, next) => {
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
exports.validateParams = validateParams;
