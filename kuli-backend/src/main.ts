import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ─── Security Headers (SEO + Security best practice) ──────────────────────
  app.use(
    helmet({
      // Content Security Policy
      contentSecurityPolicy: {
        directives: {
          defaultSrc:     ["'self'"],
          scriptSrc:      ["'self'", "'unsafe-inline'", 'https://apis.google.com'],
          styleSrc:       ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc:        ["'self'", 'https://fonts.gstatic.com'],
          imgSrc:         ["'self'", 'data:', 'https:', 'blob:'],
          connectSrc:     ["'self'", 'https://api.razorpay.com', 'wss:'],
          frameSrc:       ["'none'"],
          objectSrc:      ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      // HSTS — tells browsers to always use HTTPS
      strictTransportSecurity: {
        maxAge: 31536000,       // 1 year
        includeSubDomains: true,
        preload: true,
      },
      // Prevent clickjacking
      frameguard: { action: 'deny' },
      // Hide X-Powered-By: NestJS
      hidePoweredBy: true,
      // Prevent MIME-type sniffing
      noSniff: true,
      // XSS Filter
      xssFilter: true,
      // Referrer Policy — important for SEO (passes referrer to same origin)
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // ─── Global Validation Pipe ────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ─── CORS ─────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: [
      'https://www.kuliapp.in',
      'http://localhost:8081',
      'http://localhost:3000',
      'exp://localhost:8081',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // ─── Global API prefix ────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`\n🚀 Kuli API running at: http://localhost:${port}/api/v1`);
  console.log(`🔒 Security headers enabled (Helmet)`);
  console.log(`📡 Auth endpoints:`);
  console.log(`   POST /api/v1/auth/send-otp`);
  console.log(`   POST /api/v1/auth/verify-otp`);
  console.log(`   POST /api/v1/auth/refresh`);
  console.log(`   POST /api/v1/auth/logout\n`);
}

bootstrap();
