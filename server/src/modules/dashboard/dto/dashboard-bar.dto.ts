import { ApiProperty } from '@nestjs/swagger';

export class DashboardBarDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  income: number;

  @ApiProperty()
  expense: number;
}
