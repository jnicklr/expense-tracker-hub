import { Controller } from '@nestjs/common';
import { CustomLoggerService } from './custom-logger.service';

@Controller('custom-logger')
export class CustomLoggerController {
  constructor(private readonly customLoggerService: CustomLoggerService) {}
}
