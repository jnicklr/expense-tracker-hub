import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({
    summary: 'Realiza o login do usuário',
    description:
      'Autentica o usuário com email e senha e retorna um token JWT para acesso às rotas protegidas.',
  })
  @ApiBody({
    type: SignInDto,
    description: 'Credenciais do usuário',
    examples: {
      exemplo: {
        value: {
          email: 'usuario@email.com',
          password: '123456',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'a8sd7a6sd67a6sd786as...',
        expires_in: 3600,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas — email ou senha incorretos.',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async create(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({
    summary: 'Gera novo access token usando um refresh token válido',
    description:
      'Recebe um refresh token, valida se ainda está ativo e retorna um novo access token. Caso o refresh token esteja expirado, um novo login será necessário.',
  })
  @ApiBody({
    schema: {
      example: {
        refresh_token: 'asdhjashd67asd678asd678as...',
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Novo token gerado com sucesso.',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        expires_in: 3600,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido, expirado ou não encontrado.',
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refresh_token') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({
    summary: 'Realiza logout do usuário',
    description:
      'Invalida o refresh token do usuário, impedindo a geração de novos access tokens.',
  })
  @ApiResponse({
    status: 200,
    description: 'Logout realizado com sucesso.',
    schema: {
      example: {
        message: 'Logout realizado com sucesso.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description:
      'Token JWT inválido ou não enviado — o usuário não está autenticado.',
  })
  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    return this.authService.logout(req.user.sub);
  }

}
