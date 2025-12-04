import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransferListItem } from 'node:worker_threads';

@Injectable() // To inject the services of prisma.service
export class UserService {
  constructor(private prisma: PrismaService) {}

  /* Basicamente, essas funções são uma camada de serviço que conecta o NestJS 
   ao banco via Prisma, abstraindo o PrismaClient e permitindo que outros lugares 
   do seu app apenas chamem usersService.user(...) ou usersService.users(...).
  */

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    //garante que o método nunca retorne a senha

    //Verifica se o usuário já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Esse email já está sendo usado.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const { password, ...user } = await this.prisma.user.create({
      // Isso já exclui a senha do retorno com o spread operator, pois ele cria um novo objeto sem a senha
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return user;
  }

  // Searches for a specific user in the db
  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { password, ...result } = user;
    return result;
  }

  async getUserById(id: number): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const { password, ...result } = user;
    return result;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async users(): Promise<Omit<User, 'password'>[]> {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...user }) => user); // Remove a senha de cada usuário no array
  }

  async updateUserById(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    //Verifica se o email atualizado já está em uso por outro usuário
    if (updateUserDto.email) {
      const emailTaken = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailTaken && emailTaken.id !== id) {
        //se o email existe e o id for diferente do id do usuário que está sendo atualizado
        throw new ConflictException('Este e-mail já está em uso');
      }
    }

    const data: any = { ...updateUserDto };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...result } = user;
    return result;
  }

  // Adicionar verificação se id existe no banco
  async deleteUser(id: number): Promise<{ message: string }> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.prisma.user.delete({ where: { id } });

    return { message: 'Usuário deletado com sucesso.' };
  }
}
