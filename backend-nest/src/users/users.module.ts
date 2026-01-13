import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { MockUserModel } from './mocks/user.model.mock';

const isMockMode = process.env.USE_MOCKS === 'true' || !process.env.MONGODB_URI;

@Module({
    imports: isMockMode ? [] : [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UsersController],
    providers: [
        UsersService,
        ...(isMockMode ? [{
            provide: getModelToken(User.name),
            useValue: MockUserModel
        }] : [])
    ],
    exports: [UsersService],
})
export class UsersModule { }
