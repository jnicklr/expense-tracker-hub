import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req,
  ) {
    const userId = req.user.sub; 
    return this.categoryService.createCategory(createCategoryDto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async GetCategories(@Req() req) {
    const userId = req.user.sub; 
    return this.categoryService.categories(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async getCategoryById(@Param('id') id: string, @Req() req) {
    const userId = req.user.sub; 
    return this.categoryService.category({ id: +id, userId });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req,
  ) {
    const userId = req.user.sub; 
    return this.categoryService.updateCategory(+id, updateCategoryDto, userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string, @Req() req) {
    const userId = req.user.sub; 
    return this.categoryService.deleteCategory(+id, userId);
  }
}
