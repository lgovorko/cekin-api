import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsBoolean, IsString } from 'class-validator';

export class QuestionAnswerCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  correct: boolean;
}

export class QuestionAnswerCreateManyDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  answer: string;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  correct: boolean;
}
