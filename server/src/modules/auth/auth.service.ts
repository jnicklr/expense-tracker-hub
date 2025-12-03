import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) { }

  async signIn(dto: SignInDto) {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return this.generateTokens(user.id, user.name);
  }

  async generateTokens(userId: number, username: string) {
    const payload = { sub: userId, username };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(refresh_token, 10);

    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    await this.prisma.refreshToken.create({
      data: {
        token: hashedRefresh,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(refresh_token: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refresh_token);

      const saved = await this.prisma.refreshToken.findFirst({
        where: { userId: decoded.sub },
        orderBy: { createdAt: 'desc' },
      });

      if (!saved) throw new UnauthorizedException('Refresh não encontrado.');

      const isValid = await bcrypt.compare(refresh_token, saved.token);
      if (!isValid) throw new UnauthorizedException('Refresh inválido.');

      return this.generateTokens(decoded.sub, decoded.username);
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }
  }

  async logout(userId: number) {
    await this.prisma.refreshToken.deleteMany({
      where: { userId }
    });

    return { message: 'Logout realizado com sucesso.' };
  }

}

