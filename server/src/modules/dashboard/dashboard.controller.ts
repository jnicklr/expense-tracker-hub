import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { DashboardService } from './dashboard.service';
import { DashboardResponseDto } from './dto/dashboard-response.dto';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({
    summary: 'Retorna os dados do dashboard do usuário',
    description:
      'Busca informações agregadas de despesas, receitas, categorias, desempenho mensal e dados da última semana.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados retornados com sucesso.',
    type: DashboardResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido ou ausente.',
  })
  @Get('data')
  async getDashboardData(@Request() req) {
    return this.dashboardService.getData(req.user.sub);
  }
}
