import { config } from 'dotenv';
config(); // Load env vars immediately
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

// Initialize Sentry (do this FIRST, before app creation)
if (process.env.SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        environment: process.env.NODE_ENV || 'development',
    });
    console.log('✅ Sentry initialized');
}

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        cors: {
            // Allow all origins in development for easiest mobile testing
            origin: true,
            credentials: true
        },
        bufferLogs: true,
    });

    // Use Pino logger
    app.useLogger(app.get(Logger));

    // Security Headers
    app.use(helmet());

    // Enable compression (70% smaller payloads)
    app.use(compression());

    // Enable validation globally
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    // Swagger API Documentation
    const config = new DocumentBuilder()
        .setTitle('KULABOUR API')
        .setDescription('On-demand labor service platform API')
        .setVersion('2.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('bookings', 'Booking management')
        .addTag('services', 'Service catalog')
        .addTag('payments', 'Payment processing')
        .addTag('sync', 'Offline sync')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT || 3000;
    console.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);

    // Start on configured port
    await app.listen(port);
    console.log(`🚀 NestJS Backend running on port ${port}`);
}
bootstrap();
