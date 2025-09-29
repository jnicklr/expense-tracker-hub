import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const transaction = await this.transactionService.createTransaction(createTransactionDto);
    console.log(createTransactionDto);
    return transaction;
  }

  @Get()
  async GetTransactions() {
    return this.transactionService.transactions();
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string) {
    return this.transactionService.transaction({ id: +id });
  }

  @Patch(':id')
  async updateTransaction(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.updateTransaction(+id, updateTransactionDto);
  }

  @Delete(':id')
  async deleteTransaction(@Param('id') id: string) {
    return this.transactionService.deleteTransaction(+id);
  }
}
