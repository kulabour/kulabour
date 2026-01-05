"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const cache_manager_1 = require("@nestjs/cache-manager");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const nestjs_pino_1 = require("nestjs-pino");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const redisStore = __importStar(require("cache-manager-redis-store"));
const users_module_1 = require("./users/users.module");
const services_module_1 = require("./services/services.module");
const auth_module_1 = require("./auth/auth.module");
const sync_module_1 = require("./sync/sync.module");
const payment_module_1 = require("./payment/payment.module");
const bookings_module_1 = require("./bookings/bookings.module");
const notifications_module_1 = require("./notifications/notifications.module");
const health_module_1 = require("./health/health.module");
const chat_module_1 = require("./chat/chat.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const wallet_module_1 = require("./wallet/wallet.module");
const voice_module_1 = require("./voice/voice.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            ...(process.env.USE_MOCKS === 'true' || !process.env.MONGODB_URI
                ? []
                : [
                    mongoose_1.MongooseModule.forRootAsync({
                        imports: [config_1.ConfigModule],
                        useFactory: async (configService) => ({
                            uri: configService.get('MONGODB_URI'),
                        }),
                        inject: [config_1.ConfigService],
                    })
                ]),
            nestjs_pino_1.LoggerModule.forRoot({
                pinoHttp: {
                    transport: {
                        target: 'pino-pretty',
                        options: {
                            colorize: true,
                            translateTime: 'SYS:standard',
                            ignore: 'pid,hostname',
                        },
                    },
                    level: process.env.LOG_LEVEL || 'info',
                    serializers: {
                        req: (req) => ({
                            method: req.method,
                            url: req.url,
                            userId: req.raw?.user?.userId,
                        }),
                        res: (res) => ({
                            statusCode: res.statusCode,
                        }),
                    },
                },
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => [{
                        ttl: config.get('THROTTLE_TTL') || 60000,
                        limit: config.get('THROTTLE_LIMIT') || 100,
                    }],
            }),
            ...(process.env.REDIS_HOST
                ? [
                    cache_manager_1.CacheModule.register({
                        isGlobal: true,
                        store: redisStore,
                        host: process.env.REDIS_HOST,
                        port: parseInt(process.env.REDIS_PORT || '6379'),
                        ttl: 300,
                    })
                ]
                : [
                    cache_manager_1.CacheModule.register({
                        isGlobal: true,
                        ttl: 300,
                    })
                ]),
            ...(process.env.REDIS_HOST
                ? [
                    bull_1.BullModule.forRoot({
                        redis: {
                            host: process.env.REDIS_HOST,
                            port: parseInt(process.env.REDIS_PORT || '6379'),
                        },
                    })
                ]
                : [
                    bull_1.BullModule.forRoot({
                        redis: {
                            host: 'localhost',
                            port: 6379,
                        },
                    })
                ]),
            notifications_module_1.NotificationsModule,
            health_module_1.HealthModule,
            users_module_1.UsersModule,
            services_module_1.ServicesModule,
            auth_module_1.AuthModule,
            sync_module_1.SyncModule,
            payment_module_1.PaymentModule,
            bookings_module_1.BookingsModule,
            chat_module_1.ChatModule,
            dashboard_module_1.DashboardModule,
            wallet_module_1.WalletModule,
            voice_module_1.VoiceModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map