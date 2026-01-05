"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const services_controller_1 = require("./services.controller");
const services_service_1 = require("./services.service");
const service_schema_1 = require("./schemas/service.schema");
const service_model_mock_1 = require("./mocks/service.model.mock");
const isMockMode = process.env.USE_MOCKS === 'true' || !process.env.MONGODB_URI;
let ServicesModule = class ServicesModule {
};
exports.ServicesModule = ServicesModule;
exports.ServicesModule = ServicesModule = __decorate([
    (0, common_1.Module)({
        imports: isMockMode ? [] : [mongoose_1.MongooseModule.forFeature([{ name: service_schema_1.Service.name, schema: service_schema_1.ServiceSchema }])],
        controllers: [services_controller_1.ServicesController],
        providers: [
            services_service_1.ServicesService,
            ...(isMockMode ? [{
                    provide: (0, mongoose_1.getModelToken)(service_schema_1.Service.name),
                    useValue: service_model_mock_1.MockServiceModel
                }] : [])
        ],
    })
], ServicesModule);
//# sourceMappingURL=services.module.js.map