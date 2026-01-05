import { ServicesService } from './services.service';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    create(createServiceDto: any): Promise<import("./schemas/service.schema").Service>;
    findAll(): Promise<import("./schemas/service.schema").Service[]>;
    findOne(id: string): Promise<import("./schemas/service.schema").Service | null>;
}
