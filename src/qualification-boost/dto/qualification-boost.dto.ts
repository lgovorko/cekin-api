import { ApiProperty } from '@nestjs/swagger';

export class QualificationBoostDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  startDateTime: string;

  @ApiProperty()
  endDateTime: string;

  @ApiProperty()
  minPostalNumber: number;

  @ApiProperty()
  maxPostalNumber: number;

  @ApiProperty()
  codeTypes: string;

  @ApiProperty()
  numberOfQualifications: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
