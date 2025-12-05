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

  app.enableCors({
    origin: "http://localhost:4000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
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

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
