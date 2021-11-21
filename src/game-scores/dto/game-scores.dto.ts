import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'typeorm';

export class GameScoreDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
