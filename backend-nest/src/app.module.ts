import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LoggerModule } from 'nestjs-pino';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './auth/auth.module';
import { SyncModule } from './sync/sync.module';
import { PaymentModule } from './payment/payment.module';
import { BookingsModule } from './bookings/bookings.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthModule } from './health/health.module';
import { ChatModule } from './chat/chat.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WalletModule } from './wallet/wallet.module';
import { VoiceModule } from './voice/voice.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.local', '.env'],
        }),

        // Conditional Mongoose Module
        ...(process.env.USE_MOCKS === 'true' || !process.env.MONGODB_URI
            ? []
            : [
                MongooseModule.forRootAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        uri: configService.get<string>('MONGODB_URI'),
                    }),
                    inject: [ConfigService],
                })
            ]
        ),

        // Structured logging with Pino
        LoggerModule.forRoot({
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

        // Rate limiting
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => [{
                ttl: config.get('THROTTLE_TTL') || 60000,
                limit: config.get('THROTTLE_LIMIT') || 100,
            }],
        }),

        // Redis caching (conditionally load if configured)
        ...(process.env.REDIS_HOST
            ? [
                CacheModule.register({
                    isGlobal: true,
                    store: redisStore,
                    host: process.env.REDIS_HOST,
                    port: parseInt(process.env.REDIS_PORT || '6379'),
                    ttl: 300,
                })
            ]
            : [
                CacheModule.register({
                    isGlobal: true,
                    ttl: 300, // Memory cache fallback
                })
            ]
        ),

        // Bull message queue (conditionally load)
        ...(process.env.REDIS_HOST
            ? [
                BullModule.forRoot({
                    redis: {
                        host: process.env.REDIS_HOST,
                        port: parseInt(process.env.REDIS_PORT || '6379'),
                    },
                })
            ]
            : [
                BullModule.forRoot({
                    redis: {
                        // Mock redis config or skip queues
                        host: 'localhost',
                        port: 6379,
                    },
                })
            ]
        ),

        NotificationsModule,
        HealthModule,
        UsersModule,
        ServicesModule,
        AuthModule,
        SyncModule,
        PaymentModule,
        BookingsModule,
        ChatModule,
        DashboardModule,
        WalletModule,
        VoiceModule,
    ],
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule { }
