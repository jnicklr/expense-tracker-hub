import { ApiProperty } from '@nestjs/swagger';
import { DashboardPieDto } from './dashboard-pie.dto';
import { DashboardLineDto } from './dashboard-line.dto';
import { DashboardBarDto } from './dashboard-bar.dto';

export class DashboardResponseDto {
  @ApiProperty({ type: [DashboardPieDto] })
  pieData: DashboardPieDto[];

  @ApiProperty({ type: [DashboardLineDto] })
  lineData: DashboardLineDto[];

  @ApiProperty({ type: [DashboardBarDto] })
  barData: DashboardBarDto[];

  @ApiProperty()
  monthlyIncome: number;

  @ApiProperty()
  monthlyExpenses: number;

  @ApiProperty()
  totalBalance: number;

  @ApiProperty()
  totalInAccounts: number;
}
