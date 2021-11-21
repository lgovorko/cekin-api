import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsArray, IsNumber } from 'class-validator';
import {
  QuestionAnswerDTO,
  QuestionAnswerCreateManyDTO,
} from '../../question-answers/dto';
import { Type } from 'class-transformer';

export class QuestionCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  question: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  status: number;
}

export class QuestionsManyAnswersCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  question: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsDefined()
  @IsArray()
  @Type(() => QuestionAnswerCreateManyDTO)
  questionAnswers: QuestionAnswerCreateManyDTO[];
}
