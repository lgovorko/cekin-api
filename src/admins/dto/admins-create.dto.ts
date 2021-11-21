import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsNumber, IsIn } from 'class-validator';
import { RoleE } from '../../shared/enum';

export class AdminCreateDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  username: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;

  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @IsIn([RoleE.ADMIN, RoleE.SUPERADMIN])
  role: number;
}
