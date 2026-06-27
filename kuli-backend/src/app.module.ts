import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Load .env globally across all modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // Global Redis module — available everywhere
    RedisModule,
    // Auth module — OTP, JWT, sessions
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
