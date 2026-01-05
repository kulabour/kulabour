import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Service, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServicesService {
    constructor(
        @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async create(createServiceDto: any): Promise<Service> {
        const createdService = new this.serviceModel(createServiceDto);
        const saved = await createdService.save();

        // Invalidate cache when new service created
        await this.cacheManager.del('services:all');

        return saved;
    }

    async findAll(): Promise<Service[]> {
        const cacheKey = 'services:all';

        // Try cache first
        const cached = await this.cacheManager.get<Service[]>(cacheKey);
        if (cached) {
            console.log('📦 ServicesService.findAll: Cache HIT');
            return cached;
        }

        // Cache miss - fetch from DB
        console.log('💾 ServicesService.findAll: Cache MISS, fetching from DB');
        const services = await this.serviceModel.find({ isActive: true }).exec();

        // Store in cache (10 minutes)
        await this.cacheManager.set(cacheKey, services, 600000);

        return services;
    }

    async findOne(id: string): Promise<Service | null> {
        const cacheKey = `service:${id}`;

        // Try cache
        const cached = await this.cacheManager.get<Service>(cacheKey);
        if (cached) return cached;

        // Fetch and cache
        const service = await this.serviceModel.findById(id).exec();
        if (service) {
            await this.cacheManager.set(cacheKey, service, 300000); // 5 min
        }

        return service;
    }
}
