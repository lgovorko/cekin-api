import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PrizeDTO } from '../../prizes/dto';

export class DrawWinnersDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  userDrawQualificationId: number;

  @ApiProperty()
  prizeId: number;

  @ApiProperty()
  daily_draw_id: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

export class DrawWinnersEmbeddedDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  userDrawQualificationId: number;

  @ApiProperty()
  prizeId: number;

  @ApiProperty()
  dailyDrawId: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

export class MainDrawWinner {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  userDrawQualificationId: number;

  @ApiProperty()
  prizeId: number;

  @ApiProperty()
  daily_draw_id: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: () => PrizeDTO })
  prize: PrizeDTO;
}
