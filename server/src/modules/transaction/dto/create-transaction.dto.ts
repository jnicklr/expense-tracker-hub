import { IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Length, IsBoolean } from 'class-validator';

export class CreateTransactionDto {

    @IsInt()
    bankAccountId?: number;

    @IsInt()
    @IsNotEmpty({ message: 'A transação deve pertencer a uma categoria' })
    categoryId: number;

    @IsEnum(['income', 'expense'])
    @IsNotEmpty({ message: 'O tipo é obrigatório' })
    type: 'income' | 'expense';

    @IsNumber()
    @IsNotEmpty({ message: 'O valor é obrigatório' })
    amount: number;
    
    @IsString()
    @Length(0, 255, { message: 'A descrição deve ter no máximo 255 caracteres' })
    description: string;

    @IsBoolean()
    @IsNotEmpty({ message: 'O campo é obrigatório' })
    isEssential?: boolean;

    @IsDate()
    @IsNotEmpty({ message: 'A data da transação é obrigatória' })
    transactionAt?: Date;

}
