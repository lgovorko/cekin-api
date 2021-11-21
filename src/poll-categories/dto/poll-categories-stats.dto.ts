import { ApiProperty } from '@nestjs/swagger';

export class PollAnswersResultDTO {
  @ApiProperty()
  answer: string;

  @ApiProperty()
  total: number;
}

export class PollCategoryResultDTO {
  @ApiProperty()
  question: string;

  @ApiProperty()
  answers: PollAnswersResultDTO[];
}

export class PollCategoryStatDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  results: PollCategoryResultDTO[];
}
