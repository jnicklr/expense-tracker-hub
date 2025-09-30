import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BankAccount, Prisma } from '@prisma/client';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountService {
  constructor(private prisma: PrismaService) {}

  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccount> {
    return this.prisma.bankAccount.create({
      data: createBankAccountDto,
    });
  }

  async bankAccount(
    BankAccountWhereUniqueInput: Prisma.BankAccountWhereUniqueInput,
  ): Promise<BankAccount | null> {
    return this.prisma.bankAccount.findUnique({
      where: BankAccountWhereUniqueInput,
    });
  }

  async bankAccounts(): Promise<BankAccount[]> {
    return this.prisma.bankAccount.findMany();
  }

  async updateBankAccount(
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccount> {
    return this.prisma.bankAccount.update({
      where: { id },
      data: updateBankAccountDto,
    });
  }

  async deleteBankAccount(id: number): Promise<BankAccount> {
    return this.prisma.bankAccount.delete({
      where: { id },
    });
  }
}
