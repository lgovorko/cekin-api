import { ApiProperty } from '@nestjs/swagger';

export class UserCodeDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  code: string | null;

  @ApiProperty()
  userEntry: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  codeType: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
