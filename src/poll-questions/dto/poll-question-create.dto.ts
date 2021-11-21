import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDefined,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PollQuestionCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  pollCategoryId: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  question: string;

  @ApiProperty()
  @IsDefined()
  @ValidateNested()
  @Type(() => Answer)
  answers: Answer[];
}

class Answer {
  @ApiProperty()
  answer: string;
}
