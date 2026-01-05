import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true, trim: true })
    mobile: string;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, enum: ['customer', 'worker', 'admin'] })
    userType: string;

    @Prop({ trim: true, lowercase: true })
    email: string;

    @Prop({ default: false })
    isVerified: boolean;

    @Prop({ default: 'not_submitted', enum: ['not_submitted', 'pending', 'approved', 'rejected'] })
    verificationStatus: string;

    @Prop()
    fcmToken: string;

    @Prop({
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: [Number]
    })
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create 2dsphere index for geospatial queries
UserSchema.index({ location: '2dsphere' });
