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
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateBankAccountDto })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createBankAccount(@Body() createBankAccountDto: CreateBankAccountDto) {
    const bankAccount =
      await this.bankAccountService.createBankAccount(createBankAccountDto);
    console.log(createBankAccountDto);
    return bankAccount;
  }

  @ApiOperation({
    summary: 'Lista todas as contas bancárias',
    description:
      'Retorna uma lista de todas as contas bancárias cadastradas no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as contas bancárias foram retornadas com sucesso.',
    type: CreateBankAccountDto,
  })
  @ApiResponse({ status: 404, description: 'Contas bancárias não encontradas' })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async GetBankAccounts() {
    return this.bankAccountService.bankAccounts();
  }

  @ApiOperation({
    summary: 'Lista os dados de uma conta bancária específica',
    description:
      'Retorna os detalhes de uma conta bancária específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta bancária encontrada com sucesso',
    type: CreateBankAccountDto,
  })
  @ApiResponse({ status: 404, description: 'Conta bancária não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da conta bancária',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getBankAccountById(@Param('id') id: string) {
    return this.bankAccountService.bankAccount({ id: +id });
  }

  @ApiOperation({
    summary: 'Atualiza os dados de uma conta bancária específica',
    description:
      'Atualiza os detalhes de uma conta bancária específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta bancária atualizada com sucesso',
    type: UpdateBankAccountDto,
  })
  @ApiResponse({ status: 404, description: 'Conta bancária não encontrada' })
  @ApiBody({ type: UpdateBankAccountDto })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da conta bancária',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateBankAccount(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return this.bankAccountService.updateBankAccount(+id, updateBankAccountDto);
  }

  @ApiOperation({
    summary: 'Deleta uma conta bancária específica',
    description:
      'Deleta uma conta bancária específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Conta bancária deletada com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Conta bancária não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da conta bancária',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteBankAccount(@Param('id') id: string) {
    return this.bankAccountService.deleteBankAccount(+id);
  }
}
