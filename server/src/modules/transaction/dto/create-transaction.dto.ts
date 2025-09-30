import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Length, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {

    @ApiProperty({description: 'Identificador único da conta bancária'})
    @IsInt()
    bankAccountId: number;

    @ApiProperty({description: 'Identificador único da categoria'})
    @IsInt()
    @IsNotEmpty({ message: 'A transação deve pertencer a uma categoria' })
    categoryId: number;

    @ApiProperty({description: 'Tipo da transação: INCOME(renda) ou EXPENSE(despesa)'})
    @IsEnum(['INCOME', 'EXPENSE'])
    @IsNotEmpty({ message: 'O tipo é obrigatório' })
    type: 'INCOME' | 'EXPENSE';

    @ApiProperty({description: 'Valor da transação'})
    @IsNumber()
    @IsNotEmpty({ message: 'O valor é obrigatório' })
    amount: number;
    
    @ApiProperty({description: 'Descrição da transação'})
    @IsString()
    @Length(0, 255, { message: 'A descrição deve ter no máximo 255 caracteres' })
    description: string;

    @ApiProperty({description: 'Indica se a transação é essencial ou não'})
    @IsBoolean()
    @IsNotEmpty({ message: 'O campo é obrigatório' })
    isEssential: boolean;

    @ApiProperty({description: 'Data em que a transação foi realizada'})
    @IsDateString()
    @IsNotEmpty({ message: 'A data da transação é obrigatória' })
    transactionAt: Date;

}
