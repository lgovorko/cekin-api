import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PollQuestionDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  pollCategoryId: number;

  @ApiProperty()
  minAnswers: number; // minimal number of answers required

  @ApiProperty()
  maxAnswers: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  @Type(() => Answer)
  answers: Answer[];

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

class Answer {
  @ApiProperty()
  answer: string;
}
