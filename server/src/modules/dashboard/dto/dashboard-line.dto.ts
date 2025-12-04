import { ApiProperty } from '@nestjs/swagger';

export class DashboardLineDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  income: number;

  @ApiProperty()
  expense: number;
}
