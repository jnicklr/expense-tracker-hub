import {Controller, Get, Post, Body, Patch, Param, Delete, Put, ConsoleLogger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user') //prefixo do controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Adicionar o await antes das chamadas de métodos e fazer demais verificações como se o usuário existe e retirar a senha da resposta!
  @Post()
  async CreateUser(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    console.log(createUserDto);
    return user;
  }

  @Get()
  async GetUsers() {
    return this.userService.users();
  }

  @Get(':id') //: para definir um parametro que será passado na rota
  async getUserById(@Param('id') id: string) {
    return this.userService.user({ id: +id });
  }

  @Patch(':id')
  async UpdateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(+id, updateUserDto);  // esse + converte o valor que chega da requisição (string) para number
  }

  @Delete(':id')
  async DeleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }

  // @Post('user')
  // async CreateUser(
  //   @Body() userData: { name?: string; email: string },
  // ): Promise<UserModel> {
  //   return this.userService.createUser(userData);
  // }
}
