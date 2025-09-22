import { Module } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';
import { CustomLoggerController } from './custom-logger.controller';

@Module({
  controllers: [CustomLoggerController],
  providers: [CustomLoggerService],
})
export class CustomLoggerModule {}
