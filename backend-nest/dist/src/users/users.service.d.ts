import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: any): Promise<User>;
    findAll(): Promise<User[]>;
    findByMobile(mobile: string): Promise<User | null>;
    countActiveWorkers(): Promise<number>;
    findById(id: string): Promise<User | null>;
    updateFcmToken(userId: string, token: string): Promise<User | null>;
}
