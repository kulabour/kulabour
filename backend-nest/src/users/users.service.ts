import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: any): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findByMobile(mobile: string): Promise<User | null> {
        return this.userModel.findOne({ mobile }).exec();
    }

    async countActiveWorkers(): Promise<number> {
        return this.userModel.countDocuments({ userType: 'worker' }).exec();
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).exec();
    }

    async updateFcmToken(userId: string, token: string): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(userId, { fcmToken: token }, { new: true }).exec();
    }
}
