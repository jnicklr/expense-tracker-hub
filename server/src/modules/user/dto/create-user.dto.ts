import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(4, 20, { message: 'A senha deve ter entre 4 e 20 caracteres' })
  password: string;
}
