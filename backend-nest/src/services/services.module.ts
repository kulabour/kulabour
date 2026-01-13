import { Module } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service, ServiceSchema } from './schemas/service.schema';
import { MockServiceModel } from './mocks/service.model.mock';

const isMockMode = process.env.USE_MOCKS === 'true' || !process.env.MONGODB_URI;

@Module({
    imports: isMockMode ? [] : [MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])],
    controllers: [ServicesController],
    providers: [
        ServicesService,
        ...(isMockMode ? [{
            provide: getModelToken(Service.name),
            useValue: MockServiceModel
        }] : [])
    ],
})
export class ServicesModule { }
