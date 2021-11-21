import { IsDefined, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SettingsCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  key: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  value: string;
}
