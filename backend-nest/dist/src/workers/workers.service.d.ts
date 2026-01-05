import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
export declare class WorkersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    findNearbyWorkers(lat: number, lng: number, radiusInMeters?: number): Promise<User[]>;
}
