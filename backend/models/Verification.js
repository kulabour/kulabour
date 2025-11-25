const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    workerId: {
        type: String,
        required: true,
        ref: 'User',
    },
    workerName: {
        type: String,
        required: true,
    },
    documents: {
        aadharFront: String,
        aadharBack: String,
        laborCard: String,
        bankDetails: String,
        selfie: String,
    },
    status: {
        type: String,
        enum: ['pending', 'under_review', 'approved', 'rejected'],
        default: 'pending',
    },
    reviewedAt: Date,
    reviewedBy: String,
    rejectionReason: String,
}, {
    timestamps: true,
});

module.exports = mongoose.model('Verification', verificationSchema);
