import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto, userId: number) {
    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        userId,
      },
    });
  }

  async categories(userId: number) {
    return this.prisma.category.findMany({
      where: { userId },
    });
  }

  async category(params: { id: number; userId: number }) {
    const { id, userId } = params;

    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada para este usuário.');
    }

    return category;
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    userId: number,
  ) {
    const exists = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!exists) {
      throw new NotFoundException('Categoria não encontrada para este usuário.');
    }

    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: number, userId: number) {
    const exists = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!exists) {
      throw new NotFoundException('Categoria não encontrada para este usuário.');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
