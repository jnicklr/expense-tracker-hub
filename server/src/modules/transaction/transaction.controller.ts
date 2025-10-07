import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@ApiTags('Transações')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiOperation({
    summary: 'Cria uma nova transação',
    description:
      'Cria uma nova transação com título, valor, tipo, categoria e conta bancária associada',
  })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
    type: CreateTransactionDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction =
      await this.transactionService.createTransaction(createTransactionDto);
    console.log(createTransactionDto);
    return transaction;
  }

  @ApiOperation({
    summary: 'Lista todas as transações',
    description:
      'Retorna uma lista de todas as transações cadastradas no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as transações foram retornadas com sucesso.',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transações não encontradas' })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async GetTransactions() {
    return this.transactionService.transactions();
  }

  @ApiOperation({
    summary: 'Lista os dados de uma transação específica',
    description:
      'Retorna os detalhes de uma transação específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada com sucesso',
    type: TransactionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    return this.transactionService.transaction({ id: +id });
  }

  @ApiOperation({
    summary: 'Atualiza os dados de uma transação específica',
    description:
      'Atualiza os detalhes de uma transação específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Transação atualizada com sucesso',
    type: UpdateTransactionDto,
  })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da transação',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransaction(+id, updateTransactionDto);
  }

  @ApiOperation({
    summary: 'Deleta uma transação específica',
    description: 'Deleta uma transação específica com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Transação deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da transação',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(+id);
  }
}
