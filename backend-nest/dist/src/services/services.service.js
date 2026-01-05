"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cache_manager_1 = require("@nestjs/cache-manager");
const service_schema_1 = require("./schemas/service.schema");
let ServicesService = class ServicesService {
    constructor(serviceModel, cacheManager) {
        this.serviceModel = serviceModel;
        this.cacheManager = cacheManager;
    }
    async create(createServiceDto) {
        const createdService = new this.serviceModel(createServiceDto);
        const saved = await createdService.save();
        await this.cacheManager.del('services:all');
        return saved;
    }
    async findAll() {
        const cacheKey = 'services:all';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log('📦 ServicesService.findAll: Cache HIT');
            return cached;
        }
        console.log('💾 ServicesService.findAll: Cache MISS, fetching from DB');
        const services = await this.serviceModel.find({ isActive: true }).exec();
        await this.cacheManager.set(cacheKey, services, 600000);
        return services;
    }
    async findOne(id) {
        const cacheKey = `service:${id}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const service = await this.serviceModel.findById(id).exec();
        if (service) {
            await this.cacheManager.set(cacheKey, service, 300000);
        }
        return service;
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(service_schema_1.Service.name)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], ServicesService);
//# sourceMappingURL=services.service.js.map