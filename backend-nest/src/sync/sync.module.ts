import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { Service, ServiceSchema } from '../services/schemas/service.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Service.name, schema: ServiceSchema }])
    ],
    controllers: [SyncController],
    providers: [SyncService],
})
export class SyncModule { }
