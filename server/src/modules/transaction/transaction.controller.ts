import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@ApiTags('Transações')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({summary: 'Cria uma nova transação', description: 'Cria uma nova transação com título, valor, tipo, categoria e conta bancária associada'})
  @ApiResponse({ status: 201, description: 'Transação criada com sucesso', type: CreateTransactionDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateTransactionDto })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionService.createTransaction(createTransactionDto);
    console.log(createTransactionDto);
    return transaction;
  }

  @Get()
  @ApiOperation({summary: 'Lista todas as transações', description: 'Retorna uma lista de todas as transações cadastradas no sistema'})
  @ApiResponse({ status: 200, description: 'Todas as transações foram retornadas com sucesso.', type: CreateTransactionDto })
  @ApiResponse({ status: 404, description: 'Transações não encontradas' })
  async GetTransactions() {
    return this.transactionService.transactions();
  }

  @Get(':id')
  @ApiOperation({summary: 'Lista os dados de uma transação específica', description: 'Retorna os detalhes de uma transação específica com base no ID fornecido'})
  @ApiResponse({ status: 200, description: 'Transação encontrada com sucesso', type: CreateTransactionDto })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  async getTransactionById(@Param('id') id: string) {
    return this.transactionService.transaction({ id: +id });
  }

  @Patch(':id')
  @ApiOperation({summary: 'Atualiza os dados de uma transação específica', description: 'Atualiza os detalhes de uma transação específica com base no ID fornecido'})
  @ApiResponse({ status: 200, description: 'Transação atualizada com sucesso', type: UpdateTransactionDto })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiBody({ type: UpdateTransactionDto })
  @ApiParam({ name: 'id', description: 'Identificador único da transação', type: Number })
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransaction(+id, updateTransactionDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Deleta uma transação específica', description: 'Deleta uma transação específica com base no ID fornecido'})
  @ApiResponse({ status: 200, description: 'Transação deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Transação não encontrada' })
  @ApiParam({ name: 'id', description: 'Identificador único da transação', type: Number })
  async deleteTransaction(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(+id);
  }
}
