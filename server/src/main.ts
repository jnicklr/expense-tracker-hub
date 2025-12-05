import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './shared/custom-logger/custom-logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  const server = express();

  // const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
  //   logger: new CustomLoggerService(),
  // });

  const app = await NestFactory.create(AppModule);

  const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:4000";

  app.enableCors({
    origin: corsOrigin.split(","),
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Expense Tracker Hub')
    .setDescription('API para monitoramento e controle financeiro')
    .setVersion('1.0')
    .addTag('Autenticação')
    .addTag('Usuários')
    .addTag('Contas Bancárias')
    .addTag('Categorias')
    .addTag('Transações')
    .addBearerAuth()
    .build();

  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle('Expense Tracker Hub')
      .setDescription('API para monitoramento e controle financeiro')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
