import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FunFactsCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  text: string;
}
