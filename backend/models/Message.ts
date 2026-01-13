import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage extends Document {
    bookingId: Types.ObjectId;
    senderId: Types.ObjectId;
    senderName: string;
    message: string;
    type: 'text' | 'image' | 'location';
    readBy: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    bookingId: {
        type: Schema.Types.ObjectId,
        ref: 'Booking',
        required: true,
        index: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['text', 'image', 'location'],
        default: 'text'
    },
    readBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// Index for fetching chat history
messageSchema.index({ bookingId: 1, createdAt: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);
