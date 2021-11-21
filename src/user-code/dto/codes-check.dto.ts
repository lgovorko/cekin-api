import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MaxLength, MinLength } from 'class-validator';

export class CodeCheckDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  code: string;
}
