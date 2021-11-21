import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class QualificationBoostCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  startDateTime: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  endDateTime: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Min(10000)
  @Max(54000)
  minPostalNumber: number;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @Min(10000)
  @Max(54000)
  maxPostalNumber: number;

  @ApiProperty()
  @IsDefined()
  @IsString()
  codeTypes: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  numberOfQualifications: number;
}
