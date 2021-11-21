import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PollQuestionUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  pollCategoryId: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  question: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => Answer)
  answers: Answer[];
}

class Answer {
  @ApiProperty()
  answer: string;
}
