import { ApiProperty } from '@nestjs/swagger';

export class DailyDrawStatsDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  drawdate: string;

  @ApiProperty()
  codeEntry: number;

  @ApiProperty()
  drawQualifications: number;

  @ApiProperty()
  quizStarted: number;

  @ApiProperty()
  quizFinished: number;

  @ApiProperty()
  sharedCount: number;
}
