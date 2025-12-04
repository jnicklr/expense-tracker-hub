import { ApiProperty } from '@nestjs/swagger';

export class DashboardPieDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: number;
}
