import { IsInt, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBankAccountDto {

  @IsInt()
  @IsNotEmpty({ message: 'A conta deve estar vinculada a um usuário' })
  userId: number;

  @IsString()
  @IsNotEmpty({ message: 'O nome da conta é obrigatório' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'O número da conta é obrigatório' })
  @Length(5, 20, {message: 'O número da conta deve ter entre 5 e 20 caracteres'})
  number: string;

  @IsString()
  @IsNotEmpty({ message: 'O número da agência é obrigatório' })
  @Length(3, 10, {message: 'O número da agência deve ter entre 3 e 10 caracteres'})
  agency: string;
}
