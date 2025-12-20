const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { authenticateToken } = require('../middleware/auth');

// In-memory storage (Replace with DB model in production)
let verifications = [];
let verificationIdCounter = 1;

// Validation Schema
const submitSchema = Joi.object({
    workerId: Joi.string().required(),
    workerName: Joi.string().required(),
    documents: Joi.object().required() // Can be refined to validate specific doc fields
});

// Submit verification documents (Protected)
router.post('/documents', authenticateToken, (req, res, next) => {
    try {
        const { error } = submitSchema.validate(req.body);
        if (error) return res.status(400).json({ success: false, error: error.details[0].message });

        const { workerId, workerName, documents } = req.body;

        // documents = { aadharFront, aadharBack, laborCard, bankDetails, selfie }
        const verification = {
            id: verificationIdCounter++,
            workerId,
            workerName,
            documents,
            status: 'pending', // pending, under_review, approved, rejected
            submittedAt: new Date().toISOString(),
            reviewedAt: null,
            reviewedBy: null,
            rejectionReason: null,
        };

        verifications.push(verification);

        res.status(201).json({
            success: true,
            data: verification,
            message: 'Verification documents submitted successfully',
        });
    } catch (err) {
        next(err);
    }
});

// Get verification status (Protected)
router.get('/status/:workerId', authenticateToken, (req, res, next) => {
    try {
        const verification = verifications.find(v => v.workerId === req.params.workerId);

        if (!verification) {
            return res.json({
                success: true,
                data: {
                    status: 'not_submitted',
                    message: 'No verification documents found',
                },
            });
        }

        res.json({ success: true, data: verification });
    } catch (err) {
        next(err);
    }
});

// Admin: Approve verification
router.put('/:id/approve', authenticateToken, (req, res) => {
    const verification = verifications.find(v => v.id === parseInt(req.params.id));

    if (!verification) {
        return res.status(404).json({ success: false, error: 'Verification not found' });
    }

    verification.status = 'approved';
    verification.reviewedAt = new Date().toISOString();
    verification.reviewedBy = req.body.adminId || 'admin';

    res.json({
        success: true,
        data: verification,
        message: 'Worker verification approved',
    });
});

// Admin: Reject verification
router.put('/:id/reject', authenticateToken, (req, res) => {
    const { reason } = req.body;
    const verification = verifications.find(v => v.id === parseInt(req.params.id));

    if (!verification) {
        return res.status(404).json({ success: false, error: 'Verification not found' });
    }

    verification.status = 'rejected';
    verification.rejectionReason = reason;
    verification.reviewedAt = new Date().toISOString();
    verification.reviewedBy = req.body.adminId || 'admin';

    res.json({
        success: true,
        data: verification,
        message: 'Worker verification rejected',
    });
});

// Get all pending verifications (Admin)
router.get('/pending', authenticateToken, (req, res) => {
    const pending = verifications.filter(v => v.status === 'pending');
    res.json({ success: true, data: pending, count: pending.length });
});

module.exports = router;
