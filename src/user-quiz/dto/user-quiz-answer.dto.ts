import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';
import { QuestionUserQuizDTO } from '../../questions/dto';
import {
  QuestionUserQuizPreviousAnswerDTO,
} from '../../question-answers/dto';
import { Type } from 'class-transformer';

export class UserQuizAnswerDTO {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  answerId: number;
}

export class UserQuizAnswerResponseDTO {
  @ApiProperty()
  userQuizId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  progress: string;

  @ApiProperty()
  start: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  expired: boolean;

  @ApiProperty()
  qualifications: number;

  @ApiProperty()
  @Type(() => QuestionUserQuizDTO)
  question: QuestionUserQuizDTO;

  @ApiProperty()
  previousAnswer?: QuestionUserQuizPreviousAnswerDTO;
}
