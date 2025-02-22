import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { join } from 'path';
import * as express from 'express';

function addSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Phone Book API')
    .setDescription('The Phone Book API with JWT authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('contacts', 'Contact management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customCssUrl: '/swagger.css',
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addSwagger(app);
  await app.listen(3000);
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
}
bootstrap();
