import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categorias')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'Cria uma nova categoria',
    description: 'Cria uma nova categoria com nome e descrição',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: CreateCategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const category =
      await this.categoryService.createCategory(createCategoryDto);
    console.log(createCategoryDto);
    return category;
  }

  @ApiOperation({
    summary: 'Lista todas as categorias',
    description:
      'Retorna uma lista de todas as categorias cadastradas no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Todas as categorias foram retornadas com sucesso.',
    type: CreateCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Categorias não encontradas' })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async GetCategories() {
    return this.categoryService.categories();
  }

  @ApiOperation({
    summary: 'Lista os dados de uma categoria específica',
    description:
      'Retorna os detalhes de uma categoria específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    type: CreateCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da categoria',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.category({ id: +id });
  }

  @ApiOperation({
    summary: 'Atualiza os dados de uma categoria específica',
    description:
      'Atualiza os detalhes de uma categoria específica com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: UpdateCategoryDto,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da categoria',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory(+id, updateCategoryDto);
  }

  @ApiOperation({
    summary: 'Deleta uma categoria específica',
    description: 'Deleta uma categoria específica com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Categoria deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único da categoria',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(+id);
  }
}
