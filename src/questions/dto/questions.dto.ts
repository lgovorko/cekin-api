import { ApiProperty } from '@nestjs/swagger';

import { QuestionAnswerDTO } from '../../question-answers/dto';
import { Type } from 'class-transformer';

export class QuestionDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

export class QuestionUserQuizDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  @Type(() => QuestionAnswerDTO)
  questionAnswers: QuestionAnswerDTO[]
}
