import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber } from 'class-validator';

export class PollStartDTO {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  pollCategoryId: number;
}

export class PollAnswerQuestionDTO {
  @ApiProperty()
  questionId: number;

  @ApiProperty()
  answers: string;
}

class PollQuestionAnswersDTO {
  @ApiProperty()
  answer: string;
}

class PollQuestionDTO {
  @ApiProperty()
  questionId: number;

  @ApiProperty()
  question: string;

  @ApiProperty()
  minAnswers;

  @ApiProperty()
  maxAnswers;

  @ApiProperty()
  answers: PollQuestionAnswersDTO[];
}

export class PollDTO {
  @ApiProperty()
  pollCategoryId: number;

  @ApiProperty()
  userPollId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  progress: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  question: PollQuestionDTO;
}
