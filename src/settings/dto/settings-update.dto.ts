import { IsString, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SettingsUpdateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  value: string;
}
