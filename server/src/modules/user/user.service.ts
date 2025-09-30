import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable() // To inject the services of prisma.service
export class UserService {
  constructor(private prisma: PrismaService) {}

  /* Basicamente, essas funções são uma camada de serviço que conecta o NestJS 
   ao banco via Prisma, abstraindo o PrismaClient e permitindo que outros lugares 
   do seu app apenas chamem usersService.user(...) ou usersService.users(...).
  */

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hasgedPassword = await bcrypt.hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: {
        ...createUserDto, // DTO direto
        password: hasgedPassword, //sobrescreve a senha do objeto espalhado
      },
    });
  }

  // Searches for a specific user in the db
  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  // Searches for a list of users using filters, sorting (ordenação) and pagination
  async users(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // Adicionar fazer a verificação se id existe no banco e não retornar a senha
  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Adicionar verificação se id existe no banco
  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
