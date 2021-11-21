import { ApiProperty } from '@nestjs/swagger';

export class DailyDrawDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  prizeId: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  drawDate: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

export class CustomDailyDrawResponseDTO {
  @ApiProperty()
  data: DailyDrawDTO[];

  @ApiProperty()
  count: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pageCount: number;
}
