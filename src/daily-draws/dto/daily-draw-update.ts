import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsIn } from 'class-validator';
import { DailyDrawStatusE } from '../enum';

export class DailyDrawUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  prizeId: number;

  @ApiProperty()
  @IsOptional()
  @IsIn([DailyDrawStatusE.ACTIVE, DailyDrawStatusE.INACTIVE])
  @IsNumber()
  status: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  drawDate: string;
}
