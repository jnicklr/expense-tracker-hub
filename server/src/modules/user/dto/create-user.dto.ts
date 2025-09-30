import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Identificador único do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @Length(4, 20, { message: 'A senha deve ter entre 4 e 20 caracteres' })
  password: string;
}
