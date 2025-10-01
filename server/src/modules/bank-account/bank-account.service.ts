import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

    const existingBankAccount = await this.prisma.bankAccount.findFirst({
        where: { 
          userId: createBankAccountDto.userId,
          number: createBankAccountDto.number,
          agency: createBankAccountDto.agency
        },
      });
      
    if (existingBankAccount) {
      throw new ConflictException('Conta bancária já adicionada.');
    }

    return this.prisma.bankAccount.create({
      data: createBankAccountDto,
    });
  }

  async bankAccount(
    BankAccountWhereUniqueInput: Prisma.BankAccountWhereUniqueInput,
  ): Promise<BankAccount> {

    const bankAccount = await this.prisma.bankAccount.findUnique({
        where: BankAccountWhereUniqueInput,
      });

    if (!bankAccount) {
      throw new NotFoundException('Conta bancária não encontrada.');
    }

    return bankAccount;
  }

  async bankAccounts(): Promise<BankAccount[]> {
    return this.prisma.bankAccount.findMany();
  }

  async updateBankAccount(
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
  ): Promise<BankAccount> {

    const existingBankAccount = await this.prisma.bankAccount.findUnique({
        where: { id },
      });

    if (!existingBankAccount) {
      throw new NotFoundException('Conta bancária não encontrada.');
    }

    return this.prisma.bankAccount.update({
      where: { id },
      data: updateBankAccountDto,
    });
  }

  async deleteBankAccount(id: number): Promise<{ message: string }> {

    const existingBankAccount = await this.prisma.bankAccount.findUnique({
        where: { id },
      });

    if (!existingBankAccount) {
      throw new NotFoundException('Conta bancária não encontrada.');
    }

    await this.prisma.bankAccount.delete({where: { id }});
      
      return { message: 'Conta bancária deletada com sucesso.' };
  }
}
