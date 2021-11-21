import { ApiProperty } from '@nestjs/swagger';

export class UserPollDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  pollCategoryId: number;

  @ApiProperty()
  answers: string;

  @ApiProperty()
  isFinished: boolean;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
