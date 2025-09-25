import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomLoggerService } from './custom-logger/custom-logger.service';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

async function bootstrap() {
  const server = express();

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
    {
      logger: new CustomLoggerService(),
    },
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
