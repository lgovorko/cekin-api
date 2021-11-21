import { ApiProperty } from '@nestjs/swagger';
import { QuestionUserQuizDTO } from '../../questions/dto';
import { IsDefined, IsNumber } from 'class-validator';

export class UserQuizStartRequestDTO {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  userDrawQualificationId: number;
}

export class UserQuizStartResponseDTO {
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
  question: QuestionUserQuizDTO;
}
