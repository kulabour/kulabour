import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    mobile: string;
    name: string;
    userType: string;
    email: string;
    isVerified: boolean;
    verificationStatus: string;
    fcmToken: string;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
