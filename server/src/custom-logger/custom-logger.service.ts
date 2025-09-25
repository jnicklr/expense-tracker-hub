import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class CustomLoggerService implements LoggerService {
  private context = 'NestApp'; // define o valor padrão aqui

  log(message: any, context?: string) {
    console.log(`[LOG] [${context || this.context}] ${message}`);
  }

  error(message: any, trace?: string, context?: string) {
    console.error(`[ERROR] [${context || this.context}] ${message}`, trace || '');
  }

  warn(message: any, context?: string) {
    console.warn(`[WARN] [${context || this.context}] ${message}`);
  }

  debug?(message: any, context?: string) {
    console.debug(`[DEBUG] [${context || this.context}] ${message}`);
  }

  verbose?(message: any, context?: string) {
    console.info(`[VERBOSE] [${context || this.context}] ${message}`);
  }
}
