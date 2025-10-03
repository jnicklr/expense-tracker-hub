import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { BankAccountModule } from './modules/bank-account/bank-account.module';
import { PrometheusModule } from './modules/prometheus/prometheus.module';
import { CustomLoggerModule } from './shared/custom-logger/custom-logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    UserModule,
    CategoryModule,
    TransactionModule,
    BankAccountModule,
    // PrometheusModule,
    CustomLoggerModule,
    AuthModule,
    CacheModule.registerAsync({
      isGlobal: true, // deixa disponível em toda a aplicação
      useFactory: async () => ({
        store: await redisStore({
          host: 'localhost',
          port: 6379,
          ttl: 60 * 5, // tempo de vida do cache: 5 minutos
        }),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
