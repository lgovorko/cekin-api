import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionAnswerUpdateDTO } from '../../question-answers/dto';

export class QuestionUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  question: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  status: number;
}

export class QuestionsManyAnswersUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  question: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @Type(() => QuestionAnswerUpdateDTO)
  questionAnswers: QuestionAnswerUpdateDTO[];
}
