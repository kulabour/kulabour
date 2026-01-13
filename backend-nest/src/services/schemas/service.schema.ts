import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true })
    category: string;

    @Prop({ required: true, min: 0 })
    price: number;

    @Prop()
    description: string;

    @Prop()
    imageUrl: string;

    @Prop({ default: true })
    isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
