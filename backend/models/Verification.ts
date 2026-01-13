import mongoose, { Document, Schema } from 'mongoose';

export interface IVerification extends Document {
    workerId: string;
    workerName: string;
    documents?: {
        aadharFront?: string;
        aadharBack?: string;
        laborCard?: string;
        bankDetails?: string;
        selfie?: string;
    };
    status: 'pending' | 'under_review' | 'approved' | 'rejected';
    reviewedAt?: Date;
    reviewedBy?: string;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const verificationSchema = new Schema<IVerification>({
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

export default mongoose.model<IVerification>('Verification', verificationSchema);
