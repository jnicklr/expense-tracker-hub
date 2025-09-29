import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Controller('bank-account')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  async createBankAccount(@Body() createBankAccountDto: CreateBankAccountDto) {
    const bankAccount = await this.bankAccountService.createBankAccount(createBankAccountDto);
    console.log(createBankAccountDto);
    return bankAccount;
  }

  @Get()
  async GetBankAccounts() {
    return this.bankAccountService.bankAccounts();
  }

  @Get(':id')
  async getBankAccountById(@Param('id') id: string) {
    return this.bankAccountService.bankAccount({ id: +id });
  }

  @Patch(':id')
  async updateBankAccount(
    @Param('id') id: string,
    @Body() updateBankAccountDto: UpdateBankAccountDto,
  ) {
    return this.bankAccountService.updateBankAccount(+id, updateBankAccountDto);
  }

  @Delete(':id')
  async deleteBankAccount(@Param('id') id: string) {
    return this.bankAccountService.deleteBankAccount(+id);
  }
}
