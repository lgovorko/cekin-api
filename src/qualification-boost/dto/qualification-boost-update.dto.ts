import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QualificationBoostUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  startDateTime: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  endDateTime: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(10000)
  @Max(54000)
  minPostalNumber: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @Min(10000)
  @Max(54000)
  maxPostalNumber: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  codeTypes: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  numberOfQualifications: number;
}
