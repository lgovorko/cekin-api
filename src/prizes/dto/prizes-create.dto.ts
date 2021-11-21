import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsString,
  IsOptional,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PrizeStatusE } from '../enum';

export class PrizeCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  type: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsIn([PrizeStatusE.ACTIVE, PrizeStatusE.INACTIVE])
  @Type(() => Number)
  status: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Type(() => Number)
  totalCount: number;
}
