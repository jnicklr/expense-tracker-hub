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
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@ApiTags('Contas Bancárias')
@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @ApiOperation({
    summary: 'Cria uma nova conta bancária',
    description:
      'Cria uma nova conta bancária com nome do banco, número da conta e saldo inicial',
  })
  @ApiResponse({
    status: 201,
    description: 'Conta bancária criada com sucesso',
    type: CreateBankAccountDto,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createBankAccount(
    @Body() createBankAccountDto: CreateBankAccountDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.bankAccountService.createBankAccount(
      createBankAccountDto,
      userId,
    );
  }

  @ApiOperation({
    summary: 'Lista todas as contas bancárias do usuário logado',
  })
  @ApiResponse({
    status: 200,
    description: 'Contas encontradas com sucesso.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async GetBankAccounts(@Req() req) {
    return this.bankAccountService.bankAccounts(req.user.sub);
  }

  @ApiOperation({
    summary: 'Retorna os dados de uma conta bancária específica',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getBankAccountById(@Param('id') id: string, @Req() req) {
    return this.bankAccountService.bankAccount(+id, req.user.sub);
  }

  @ApiOperation({
    summary: 'Atualiza uma conta bancária específica',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateBankAccount(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
    @Req() req,
  ) {
    return this.bankAccountService.updateBankAccount(
      +id,
      updateBankAccountDto,
      req.user.sub,
    );
  }

  @ApiOperation({
    summary: 'Exclui uma conta bancária específica',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteBankAccount(@Param('id') id: string, @Req() req) {
    return this.bankAccountService.deleteBankAccount(+id, req.user.sub);
  }
}
