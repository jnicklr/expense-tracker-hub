import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Length, IsBoolean } from 'class-validator';

export class CreateTransactionDto {

    @IsInt()
    bankAccountId: number;

    @IsInt()
    @IsNotEmpty({ message: 'A transação deve pertencer a uma categoria' })
    categoryId: number;

    @IsEnum(['INCOME', 'EXPENSE'])
    @IsNotEmpty({ message: 'O tipo é obrigatório' })
    type: 'INCOME' | 'EXPENSE';

    @IsNumber()
    @IsNotEmpty({ message: 'O valor é obrigatório' })
    amount: number;
    
    @IsString()
    @Length(0, 255, { message: 'A descrição deve ter no máximo 255 caracteres' })
    description: string;

    @IsBoolean()
    @IsNotEmpty({ message: 'O campo é obrigatório' })
    isEssential: boolean;

    @IsDateString()
    @IsNotEmpty({ message: 'A data da transação é obrigatória' })
    transactionAt: Date;

}
