import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: new CustomLoggerService(),
  });

  const config = new DocumentBuilder()
    .setTitle('Expense Tracker Hub')
    .setDescription('API para monitoramento e controle financeiro')
    .setVersion('1.0')
    .addTag('Usuários')
    .addTag('Contas Bancárias')
    .addTag('Categorias')
    .addTag('Transações')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
