import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsIn } from 'class-validator';
import { RoleE } from '../../shared/enum';

export class AdminUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  username: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsIn([RoleE.ADMIN, RoleE.SUPERADMIN])
  role: number;
}
