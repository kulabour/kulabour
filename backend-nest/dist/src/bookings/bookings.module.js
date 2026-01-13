"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bookings_service_1 = require("./bookings.service");
const booking_schema_1 = require("./schemas/booking.schema");
const bookings_gateway_1 = require("./bookings.gateway");
const bookings_controller_1 = require("./bookings.controller");
const workers_module_1 = require("../workers/workers.module");
const booking_model_mock_1 = require("./mocks/booking.model.mock");
const isMock = process.env.USE_MOCKS === 'true' || !process.env.MONGODB_URI;
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            ...(isMock
                ? []
                : [mongoose_1.MongooseModule.forFeature([{ name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema }])]),
            workers_module_1.WorkersModule
        ],
        controllers: [bookings_controller_1.BookingsController],
        providers: [
            bookings_service_1.BookingsService,
            bookings_gateway_1.BookingsGateway,
            ...(isMock
                ? [{
                        provide: (0, mongoose_1.getModelToken)(booking_schema_1.Booking.name),
                        useValue: booking_model_mock_1.MockBookingModel
                    }]
                : [])
        ],
        exports: [bookings_service_1.BookingsService],
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map