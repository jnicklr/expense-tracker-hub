import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user: User | null = await this.userService.getUserByEmail(
      signInDto.email,
    );

    const isValid: boolean | null =
      user && (await bcrypt.compare(signInDto.password, user.password));

    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: user?.id, username: user?.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
