import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@ApiTags('Transações')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createTransaction(@Req() req, @Body() dto: CreateTransactionDto) {
    const userId = req.user.sub;
    return this.transactionService.createTransaction(dto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async GetTransactions(@Req() req) {
    const userId = req.user.sub;
    return this.transactionService.transactions(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getTransactionById(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.transactionService.transaction({ id: +id, userId });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateTransaction(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    const userId = req.user.sub;
    return this.transactionService.updateTransaction(+id, dto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteTransaction(@Req() req, @Param('id') id: string) {
    const userId = req.user.sub;
    return this.transactionService.deleteTransaction(+id, userId);
  }
}
