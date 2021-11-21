import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class WeeklySummaryDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: string;

  @ApiProperty()
  releasedProducts: number;

  @ApiProperty()
  pctProductsAvailable: number;

  @ApiProperty()
  pctProductsSold: number;

  @ApiProperty()
  totalFollowersFb: number;

  @ApiProperty()
  totalFollowersInsta: number;

  @ApiProperty()
  engagementFb: number;

  @ApiProperty()
  engagementInsta: number;

  @ApiProperty()
  reachFb: number;

  @ApiProperty()
  reachInsta: number;

  @ApiProperty()
  gaClicks: number;

  @ApiProperty()
  gaImpressions: number;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}

export class WeeklySummaryDataDTO {
  @ApiProperty()
  date: string;

  @ApiProperty()
  newUsers: number;

  @ApiProperty()
  validCodes: number;

  @ApiProperty()
  invalidCodes: number;

  @ApiProperty()
  duplicateCodes: number;

  @ApiProperty()
  kozje: number;

  @ApiProperty()
  kalcij: number;

  @ApiProperty()
  bezLaktoze: number;

  @ApiProperty()
  releasedProducts: number;

  @ApiProperty()
  pctProductsAvailable: number;

  @ApiProperty()
  pctProductsSold: number;

  @ApiProperty()
  totalFollowersFb: number;

  @ApiProperty()
  totalFollowersInsta: number;

  @ApiProperty()
  engagementFb: number;

  @ApiProperty()
  engagementInsta: number;

  @ApiProperty()
  reachFb: number;

  @ApiProperty()
  reachInsta: number;

  @ApiProperty()
  gaClicks: number;

  @ApiProperty()
  gaImpressions: number;
}
