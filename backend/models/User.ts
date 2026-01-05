import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    mobile: string;
    name: string;
    userType: 'customer' | 'worker';
    email?: string;
    isVerified: boolean;
    verificationStatus: 'not_submitted' | 'pending' | 'approved' | 'rejected';
    isActive?: boolean;
    role?: string; // Derived or explicitly set if needed
    fcmToken?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userType: {
        type: String,
        enum: ['customer', 'worker'],
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationStatus: {
        type: String,
        enum: ['not_submitted', 'pending', 'approved', 'rejected'],
        default: 'not_submitted',
    },
}, {
    timestamps: true,
});

// ===== DATABASE INDEXES =====

// Phone number is already unique (enforced by schema)
// Additional index for faster lookups by user type
userSchema.index({ userType: 1, isVerified: 1 });

// For finding workers by verification status
userSchema.index({ userType: 1, verificationStatus: 1 });

export default mongoose.model<IUser>('User', userSchema);
