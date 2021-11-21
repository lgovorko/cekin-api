import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import moment from 'moment';

export class AdminDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  @Exclude()
  password: string;

  @ApiProperty()
  role: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
