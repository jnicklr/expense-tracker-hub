import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BankAccountController],
  providers: [BankAccountService],
})
export class BankAccountModule {}
