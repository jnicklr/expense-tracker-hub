import {
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { BankAccount, Prisma } from '@prisma/client';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountService {
  constructor(private prisma: PrismaService) {}

  async createBankAccount(
    createBankAccountDto: CreateBankAccountDto,
    userId: number,
  ): Promise<BankAccount> {
    const existingBankAccount = await this.prisma.bankAccount.findFirst({
      where: {
        userId,
        number: createBankAccountDto.number,
        agency: createBankAccountDto.agency,
      },
    });

    if (existingBankAccount) {
      throw new ConflictException('Conta bancária já adicionada.');
    }

    return this.prisma.bankAccount.create({
      data: {
        agency: createBankAccountDto.agency,
        number: createBankAccountDto.number,
        name: createBankAccountDto.name,
        userId: userId
      },
    });
  }

  async bankAccount(id: number, userId: number): Promise<BankAccount> {
    const bankAccount = await this.prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!bankAccount) {
      throw new NotFoundException('Conta bancária não encontrada.');
    }

    if (bankAccount.userId !== userId) {
      throw new ForbiddenException('Acesso não permitido.');
    }

    return bankAccount;
  }

  async bankAccounts(userId: number): Promise<BankAccount[]> {
    return this.prisma.bankAccount.findMany({
      where: { userId },
    });
  }

  async updateBankAccount(
    id: number,
    updateBankAccountDto: UpdateBankAccountDto,
    userId: number,
  ): Promise<BankAccount> {
    const existingBankAccount = await this.prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!existingBankAccount) {
      throw new NotFoundException('Conta bancária não encontrada.');
    }

    if (existingBankAccount.userId !== userId) {
      throw new ForbiddenException('Acesso não permitido.');
    }

    return this.prisma.bankAccount.update({
      where: { id },
      data: updateBankAccountDto,
    });
  }

  async deleteBankAccount(id: number, userId: number): Promise<{ message: string }> {
    const existingBankAccount = await this.prisma.bankAccount.findUnique({
      where: { id },
    });

    if (!existingBankAccount) {
      throw new NotFoundException('Conta bancária não encontrada.');
    }

    if (existingBankAccount.userId !== userId) {
      throw new ForbiddenException('Acesso não permitido.');
    }

    await this.prisma.bankAccount.delete({ where: { id } });

    return { message: 'Conta bancária deletada com sucesso.' };
  }
}
