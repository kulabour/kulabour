import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
    name: string;
    workers: string;
    avgPrice: string;
    icon: string;
    description?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const serviceSchema = new Schema<IService>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    workers: {
        type: String,
        required: true,
    },
    avgPrice: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true,
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model<IService>('Service', serviceSchema);
