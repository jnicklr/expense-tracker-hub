import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Transaction, Prisma } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data: createTransactionDto,
    });
  }

  async transaction(
    transactionWhereUniqueInput: Prisma.TransactionWhereUniqueInput,
  ): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({
      where: transactionWhereUniqueInput,
    });
  }

  async transactions(): Promise<Transaction[]> {
    return this.prisma.transaction.findMany();
  }

  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  async deleteTransaction(id: number): Promise<Transaction> {
    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
