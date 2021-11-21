import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import moment from 'moment';

export class UserQuizDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  answers: number;

  @ApiProperty()
  questionStartTimestamp: number;

  @ApiProperty()
  @Transform(date => moment(date).format('YYYY-MM-DD HH:mm:ss'))
  updatedAt: string;

  @ApiProperty()
  @Transform(date => moment(date).format('YYYY-MM-DD HH:mm:ss'))
  createdAt: string;
}
