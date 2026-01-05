import { Model } from 'mongoose';
import { Cache } from 'cache-manager';
import { Service, ServiceDocument } from './schemas/service.schema';
export declare class ServicesService {
    private serviceModel;
    private cacheManager;
    constructor(serviceModel: Model<ServiceDocument>, cacheManager: Cache);
    create(createServiceDto: any): Promise<Service>;
    findAll(): Promise<Service[]>;
    findOne(id: string): Promise<Service | null>;
}
