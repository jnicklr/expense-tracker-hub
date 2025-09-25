import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ConsoleLogger } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user') //prefixo do controller
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post()
  async CreateUser(
    @Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.userService.createUser(createUserDto);
  }

  // @Post('user')
  // async CreateUser(
  //   @Body() userData: { name?: string; email: string },
  // ): Promise<UserModel> {
  //   return this.userService.createUser(userData);
  // }

  @Get()
  findAll() {
    return this.userService.findAll(); 
  }

  @Get(':id') //: para definir um parametro que será passado na rota
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
