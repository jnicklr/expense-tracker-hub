import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Query
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
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

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
    @Post()
    async createCategory(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
        const category =
            await this.categoryService.createCategory(createCategoryDto, req.user.sub);
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
    @Get()
    async getCategories(@Request() req,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('search') search = "") {
        return await this.categoryService.getCategoriesPaginatedByUserId(
            req.user.sub,
            page,
            limit,
            search
        );
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
    @Get(':id')
    async getCategoryById(@Param('id') id: string, @Request() req) {

        return this.categoryService.category({ id: +id, userId: req.user.sub });
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
    @Patch(':id')
    async updateCategory(
        @Param('id') id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Request() req
    ) {
        return this.categoryService.updateCategory(+id, updateCategoryDto, req.user.sub);
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
    @Delete(':id')
    async deleteCategory(@Param('id') id: string,
        @Request() req) {
        return this.categoryService.deleteCategory(+id, req.user.sub);
    }
}
