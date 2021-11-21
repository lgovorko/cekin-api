import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional, IsString } from 'class-validator';

export class QuestionAnswerUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  correct: boolean;
}
