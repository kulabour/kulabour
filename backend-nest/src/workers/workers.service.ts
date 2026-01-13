import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class WorkersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async findNearbyWorkers(lat: number, lng: number, radiusInMeters: number = 5000): Promise<User[]> {
        // Use MongoDB $near query for geospatial search
        return this.userModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat] // [longitude, latitude]
                    },
                    $maxDistance: radiusInMeters
                }
            },
            userType: 'worker',
            isVerified: true,
        }).limit(10).exec();
    }
}
