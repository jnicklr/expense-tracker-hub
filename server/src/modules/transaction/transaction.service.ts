import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  // Criar transação
  async createTransaction(
    createTransactionDto: CreateTransactionDto,
    userId: number,
  ) {
    const { bankAccountId } = createTransactionDto;

    // Garantir que a conta pertence ao usuário
    const account = await this.prisma.bankAccount.findFirst({
      where: { id: bankAccountId, userId },
    });

    if (!account) {
      throw new NotFoundException(
        'Conta bancária não encontrada para este usuário.',
      );
    }

    return this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
      },
    });
  }

  // Listar transações do usuário
  async transactions(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        bankAccount: {
          userId,
        },
      },
      include: {
        bankAccount: true,
        category: true,
      },
    });
  }

  // Buscar 1 transação
  async transaction(params: { id: number; userId: number }) {
    const { id, userId } = params;

    const trx = await this.prisma.transaction.findFirst({
      where: {
        id,
        bankAccount: {
          userId,
        },
      },
      include: {
        bankAccount: true,
        category: true,
      },
    });

    if (!trx) {
      throw new NotFoundException(
        'Transação não encontrada para este usuário.',
      );
    }

    return trx;
  }

  // Atualizar transação
  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
    userId: number,
  ) {
    const exists = await this.prisma.transaction.findFirst({
      where: {
        id,
        bankAccount: {
          userId,
        },
      },
    });

    if (!exists) {
      throw new NotFoundException(
        'Transação não encontrada para este usuário.',
      );
    }

    return this.prisma.transaction.update({
      where: { id },
      data: updateTransactionDto,
    });
  }

  // Excluir transação
  async deleteTransaction(id: number, userId: number) {
    const exists = await this.prisma.transaction.findFirst({
      where: {
        id,
        bankAccount: {
          userId,
        },
      },
    });

    if (!exists) {
      throw new NotFoundException(
        'Transação não encontrada para este usuário.',
      );
    }

    return this.prisma.transaction.delete({
      where: { id },
    });
  }
}
