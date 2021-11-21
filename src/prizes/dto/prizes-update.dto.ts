import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsInt, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { PrizeStatusE } from '../enum';

export class PrizeUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
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
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalCount: number;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalSpent: number;
}
