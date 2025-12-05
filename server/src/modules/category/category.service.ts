import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) { }

	async createCategory(
		createCategoryDto: CreateCategoryDto, userId: number
	): Promise<Category> {
		const existingCategory = await this.prisma.category.findFirst({
			where: {
				name: createCategoryDto.name,
				userId: userId, // Impede que duas categorias com o mesmo nome sejam criadas para o mesmo usuário
			},
		});

		if (existingCategory) {
			throw new ConflictException('Categoria já cadastrada.');
		}

		return this.prisma.category.create({
			data: {
				name: createCategoryDto.name,
				description: createCategoryDto.description,
				userId: userId
			},
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

	async categories(): Promise<Category[]> {
		return this.prisma.category.findMany();
	}

	async getCategoriesPaginatedByUserId(userId: number, page: number, limit: number, search: string) {

		page = Number(page);
		limit = Number(limit);

		if (isNaN(page) || page < 1) page = 1;
		if (isNaN(limit) || limit < 1) limit = 10;

		const skip = (page - 1) * limit;

		const where: Prisma.CategoryWhereInput = search
			? {
				name: {
					contains: search,
					mode: Prisma.QueryMode.insensitive,
				},
				userId: userId,
			}
			: { userId: userId };

		const [data, total] = await Promise.all([
			this.prisma.category.findMany({
				where,
				skip,
				take: limit, // agora é realmente number!
				orderBy: { name: "asc" },
			}),

			this.prisma.category.count({ where }),
		]);

		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		};
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
