import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ConsoleLogger,
  Request,
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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Usuários')
@Controller('user') //prefixo do controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Adicionar o await antes das chamadas de métodos e fazer demais verificações como se o usuário existe e retirar a senha da resposta!
  @ApiOperation({
    summary: 'Cria um novo usuário',
    description: 'Cria um novo usuário com nome, email e senha',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiBody({ type: CreateUserDto })
  @Post()
  async CreateUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    console.log(createUserDto);
    return user;
  }

  @ApiOperation({
    summary: 'Lista todos os usuários',
    description:
      'Retorna uma lista de todos os usuários cadastrados no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Todos os usuários foram retornados com sucesso.',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuários não encontrados' })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async GetUsers() {
    return this.userService.users();
  }

  @ApiOperation({
    summary: 'Lista os dados de um usuário específico',
    description:
      'Retorna os detalhes de um usuário específico com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado com sucesso',
    type: CreateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id') //: para definir um parametro que será passado na rota
  async getUserById(@Param('id') id: string) {
    return this.userService.user({ id: +id });
  }

  @ApiOperation({
    summary: 'Atualiza os dados de um usuário específico',
    description:
      'Atualiza os detalhes de um usuário específico com base no ID fornecido',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário atualizado com sucesso',
    type: UpdateUserDto,
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiBody({ type: UpdateUserDto })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch()
  async UpdateUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.sub;
    return this.userService.updateUserById(userId, updateUserDto); // esse + converte o valor que chega da requisição (string) para number
  }

  @ApiOperation({
    summary: 'Deleta um usuário específico',
    description: 'Deleta um usuário específico com base no ID fornecido',
  })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiParam({
    name: 'id',
    description: 'Identificador único do usuário',
    type: Number,
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT ausente ou inválido.',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async DeleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }
}
