import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateBankAccountDto {
  @ApiProperty({ description: 'Identificador único do usuário' })
  @IsInt()
  @IsNotEmpty({ message: 'A conta deve estar vinculada a um usuário' })
  userId: number;

  @ApiProperty({ description: 'Nome da conta bancária' })
  @IsString()
  @IsNotEmpty({ message: 'O nome da conta é obrigatório' })
  name: string;

  @ApiProperty({ description: 'Número da conta bancária' })
  @IsString()
  @IsNotEmpty({ message: 'O número da conta é obrigatório' })
  @Length(5, 20, {
    message: 'O número da conta deve ter entre 5 e 20 caracteres',
  })
  number: string;

  @ApiProperty({ description: 'Número da agência bancária' })
  @IsString()
  @IsNotEmpty({ message: 'O número da agência é obrigatório' })
  @Length(3, 10, {
    message: 'O número da agência deve ter entre 3 e 10 caracteres',
  })
  agency: string;
}
