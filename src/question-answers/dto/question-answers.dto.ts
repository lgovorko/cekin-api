import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class QuestionAnswerDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  questionId: number;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  @Exclude()
  correct: boolean;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

export class QuestionUserQuizPreviousAnswerDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  questionId: number;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  correct: boolean;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
