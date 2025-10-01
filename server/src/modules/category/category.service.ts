import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { Category, Prisma } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {

    const existingCategory = await this.prisma.category.findFirst({
        where: { 
          name: createCategoryDto.name,
          userId: createCategoryDto.userId // Impede que duas categorias com o mesmo nome sejam criadas para o mesmo usuário
        },
      });

    if (existingCategory) {
      throw new ConflictException('Categoria já cadastrada.');
    }

    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async category(
    categoryWhereUniqueInput: Prisma.CategoryWhereUniqueInput,
  ): Promise<Category> {

    const category = await this.prisma.category.findUnique({
      where: categoryWhereUniqueInput,
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    return category;
  }

  async categories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {

    const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });

    if (!existingCategory) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    //Não vai ser possível alterar o nome de uma categoria para um nome que já existe
    if(updateCategoryDto.name){
      const categoryWithSameName = await this.prisma.category.findFirst({
        where: { name: updateCategoryDto.name },
      });
      if(categoryWithSameName && categoryWithSameName.id !== id){
        throw new ConflictException('Já existe uma categoria com esse nome.');
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: number): Promise<{ message: string }> {

    const existingCategory = await this.prisma.category.findUnique({
        where: { id },
      });

    if (!existingCategory) {
      throw new NotFoundException('Categoria não encontrada.');
    }

    await this.prisma.category.delete({where: { id }});
      
    return { message: 'Categoria deletada com sucesso.' };
  }
}
