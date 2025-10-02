import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Identificador único do usuário' })
  @IsNotEmpty({ message: 'O id é obrigatório' })
  userId: number;

  @ApiProperty({ description: 'Nome da categoria' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({ description: 'Descrição da categoria' })
  @IsString()
  @Length(0, 255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  description: string;
}
