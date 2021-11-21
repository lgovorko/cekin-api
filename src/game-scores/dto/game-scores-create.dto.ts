import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export class GameScoreFinishDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  ct: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  iv: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  s: string;
}
