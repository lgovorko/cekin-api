import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsIn, IsOptional } from 'class-validator';

export class UserDrawQualificationShareDTO {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsIn([3, 4])
  type: number;

  @ApiProperty()
  @IsNumber()
  @IsNumber()
  userDrawQualificationId: number;
}
