import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkersService } from './workers.service';
import { User, UserSchema } from '../users/schemas/user.schema';

import { MockUserModel } from '../users/mocks/user.model.mock';
import { getModelToken } from '@nestjs/mongoose';

const isMockMode = process.env.USE_MOCKS === 'true' || !process.env.MONGODB_URI;

@Module({
    imports: isMockMode ? [] : [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    providers: [
        WorkersService,
        ...(isMockMode ? [{
            provide: getModelToken(User.name),
            useValue: MockUserModel // Reuse MockUserModel from users module
        }] : [])
    ],
    exports: [WorkersService],
})
export class WorkersModule { }
