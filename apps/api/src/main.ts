import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Use Socket.IO adapter for WebSocket support
    app.useWebSocketAdapter(new IoAdapter(app));

    // Cookie parser (must be before guards that read cookies)
    app.use(cookieParser());

    // Global prefix
    app.setGlobalPrefix('api');

    // CORS
    app.enableCors({
        origin: process.env.WEB_URL || 'http://localhost:3000',
        credentials: true,
    });

    const reflector = app.get(Reflector);

    // Global pipes
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Global guards
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    // Global filters
    app.useGlobalFilters(new AllExceptionsFilter());

    // Global interceptors
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.listen(process.env.PORT ?? 3001);
    console.log(`API running on http://localhost:${process.env.PORT ?? 3001}/api`);
}
bootstrap();
