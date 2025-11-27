import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Increase body parser limits for large file uploads
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ limit: '100mb', extended: true }));

  // Increase timeout for file uploads (10 minutes = 600000ms)
  const server = app.getHttpServer();
  server.timeout = 600000; // 10 minutes
  server.keepAliveTimeout = 610000; // 11 minutes (slightly longer than timeout)
  server.headersTimeout = 620000; // 12 minutes (slightly longer than keepAliveTimeout)

  // Enable WebSocket adapter
  app.useWebSocketAdapter(new IoAdapter(app));

  // Enable CORS for all origins
  app.enableCors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
    credentials: true, // Allow cookies and authorization headers
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API documentation for NestJS application')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('health', 'Health check endpoints')
    .addTag('public-assets', 'Public asset endpoints')
    .addTag('admin-assets', 'Admin asset management endpoints')
    .addTag('public-photobooth', 'Public photobooth endpoints')
    .addTag('admin-photobooth', 'Admin photobooth management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Photobooth API Documentation',
    explorer: true,
  });

  // Serve static files from public directory (after Swagger setup)
  // Serve without prefix to allow direct access to HTML files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3000);
  console.log('🚀 Application is running on: http://localhost:3000');
  console.log('📚 Swagger documentation: http://localhost:3000/api');
}
void bootstrap();
