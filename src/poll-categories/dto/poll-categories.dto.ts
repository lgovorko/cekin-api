import { ApiProperty } from '@nestjs/swagger';

export class PollCategoryDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  extraQualification: boolean;

  @ApiProperty()
  qualificationReward: number;

  @ApiProperty()
  numberOfCodesRequired: number;

  @ApiProperty()
  ordinalNumber: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

export class PollCategoryWebDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  extraQualification: boolean;

  @ApiProperty()
  qualificationReward: number;

  @ApiProperty()
  numberOfCodesRequired: number;

  @ApiProperty()
  userPollStatus: number;

  @ApiProperty()
  ordinalNumber: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
