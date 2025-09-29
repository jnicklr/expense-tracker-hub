import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCategoryDto {

  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsString()
  @Length(0, 255, { message: 'A descrição deve ter no máximo 255 caracteres' })
  description: string;
}
