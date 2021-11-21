import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import * as moment from 'moment'

export class GameScoreLeaderboardDTO {
  @ApiProperty()
  rank: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  @Transform(createdAt => moment(createdAt).format('YYYY-MM-DD'))
  createdAt: string;
}
