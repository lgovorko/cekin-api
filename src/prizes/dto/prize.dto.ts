import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DailyDrawEmbeddedDTO } from '../../daily-draws/dto';

export class PrizeDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalSpent: number;

  @ApiProperty()
  imageFilename: string;

  @ApiProperty()
  imagePath: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

export class PrizeJoinDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  type: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  totalSpent: number;

  @ApiProperty()
  imageFilename: string;

  @ApiProperty()
  imagePath: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  @Type(() => DailyDrawEmbeddedDTO)
  dailyDraws: DailyDrawEmbeddedDTO[];
}
