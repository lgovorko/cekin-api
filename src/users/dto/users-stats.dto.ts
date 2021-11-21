import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import * as moment from 'moment';

export class UserRegistrationStatsDTO {
  @ApiProperty()
  @Transform(date => moment(date).format('YYYY-MM-DD'))
  date: string;

  @ApiProperty()
  registrations: number;
}
