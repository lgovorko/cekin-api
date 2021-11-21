import { ApiProperty } from '@nestjs/swagger';

export class UserDrawQualificationDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  type: number;

  @ApiProperty()
  extraSpent: boolean;

  @ApiProperty()
  qualificationsCount: number;

  @ApiProperty()
  quizFinished: boolean;

  @ApiProperty()
  quizCorrectAnswers: number;

  @ApiProperty()
  isShared: boolean;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
