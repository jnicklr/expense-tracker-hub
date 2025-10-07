import { ApiProperty } from '@nestjs/swagger';

class BankAccountDto {
    @ApiProperty({ example: 1, description: 'Identificador único da conta bancária' })
    id: number;

    @ApiProperty({ description: 'Identificador único do usuário' })
    userId: number;

    @ApiProperty({ example: 'Conta Itaú', description: 'Nome da conta bancária' })
    name: string;

    @ApiProperty({ description: 'Número da conta bancária' })
    number: string;

    @ApiProperty({ description: 'Número da agência bancária' })
    agency: string;

    @ApiProperty({
        example: '2025-10-07T02:19:36.186Z',
        description: 'Data de criação do registro',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2025-10-07T02:19:36.186Z',
        description: 'Data da última atualização do registro',
    })
    updatedAt: Date;
}

class CategoryDto {
    @ApiProperty({ example: 1, description: 'Identificador único da categoria' })
    id: number;

    @ApiProperty({ description: 'Identificador único do usuário' })
    userId: number;

    @ApiProperty({ description: 'Nome da categoria' })
    name: string;

    @ApiProperty({ description: 'Descrição da categoria' })
    description: string;

    @ApiProperty({
        example: '2025-10-07T02:19:36.186Z',
        description: 'Data de criação do registro',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2025-10-07T02:19:36.186Z',
        description: 'Data da última atualização do registro',
    })
    updatedAt: Date;
}

export class TransactionResponseDto {
    @ApiProperty({ example: 1, description: 'Identificador único da transação' })
    id: number;

    @ApiProperty({ example: 1, description: 'Identificador da conta bancária associada' })
    bankAccountId: number;

    @ApiProperty({ example: 1, description: 'Identificador da categoria associada' })
    categoryId: number;

    @ApiProperty({ example: 'EXPENSE', description: 'Tipo da transação (ex: EXPENSE ou INCOME)' })
    type: string;

    @ApiProperty({ example: 2000, description: 'Valor da transação' })
    amount: number;

    @ApiProperty({ example: 'Computador Positivo', description: 'Descrição da transação' })
    description: string;

    @ApiProperty({ example: true, description: 'Indica se a transação é essencial' })
    isEssential: boolean;

    @ApiProperty({
        example: '2025-10-07T02:19:00.778Z',
        description: 'Data e hora da transação',
    })
    transactionAt: Date;

    @ApiProperty({
        example: '2025-10-07T02:19:36.186Z',
        description: 'Data de criação do registro',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2025-10-07T02:19:36.186Z',
        description: 'Data da última atualização do registro',
    })
    updatedAt: Date;

    @ApiProperty({ type: BankAccountDto, description: 'Conta bancária relacionada à transação' })
    bankAccount: BankAccountDto;

    @ApiProperty({ type: CategoryDto, description: 'Categoria relacionada à transação' })
    category: CategoryDto;
}
