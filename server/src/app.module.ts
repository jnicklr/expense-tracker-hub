import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { BankAccountModule } from './modules/bank-account/bank-account.module';
import { PrometheusModule } from './prometheus/prometheus.module';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';

@Module({
  imports: [UserModule, CategoryModule, TransactionModule, BankAccountModule, PrometheusModule, CustomLoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
