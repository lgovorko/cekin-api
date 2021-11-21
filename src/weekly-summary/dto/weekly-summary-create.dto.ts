import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class WeeklySummaryCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  date: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  releasedProducts: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  pctProductsAvailable: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  pctProductsSold: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalFollowersFb: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalFollowersInsta: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  engagementFb: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  engagementInsta: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  reachFb: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  reachInsta: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  gaClicks: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  gaImpressions: number;
}
