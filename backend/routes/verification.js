const express = require('express');
const router = express.Router();

// In-memory storage
let verifications = [];
let verificationIdCounter = 1;

// Submit verification documents
router.post('/documents', (req, res) => {
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
});

// Get verification status
router.get('/status/:workerId', (req, res) => {
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
});

// Admin: Approve verification
router.put('/:id/approve', (req, res) => {
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
router.put('/:id/reject', (req, res) => {
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
router.get('/pending', (req, res) => {
    const pending = verifications.filter(v => v.status === 'pending');
    res.json({ success: true, data: pending, count: pending.length });
});

module.exports = router;
