import { ApiProperty } from '@nestjs/swagger';

export class CodeDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  type: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
