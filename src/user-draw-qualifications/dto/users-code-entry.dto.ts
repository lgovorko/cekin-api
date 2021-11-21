import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class UserCodeEntryDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  code: string;
}
