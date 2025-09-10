import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        level: 'info',
      },
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Register CORS
  await app.register(require('@fastify/cors'), {
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  });

  // Register rate limit
  await app.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute',
  });

  // Register multipart
  await app.register(require('@fastify/multipart'));

  // Global prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || 8000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Motorcycle Wash API is running on: http://localhost:${port}/api/v1`);
  console.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 Timezone: ${config.TZ}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});