import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrometheusModule } from './prometheus/prometheus.module';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';

@Module({
  imports: [UserModule, PrometheusModule, CustomLoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
