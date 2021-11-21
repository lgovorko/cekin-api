import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsDefined } from 'class-validator';

export class ResetUserPasswordRequestDTO {
  @ApiProperty()
  @IsEmail()
  @IsDefined()
  email: string;
}

export class ResetUserPasswordResponseDTO {
  @ApiProperty()
  @IsEmail()
  @IsDefined()
  message: string;
}
