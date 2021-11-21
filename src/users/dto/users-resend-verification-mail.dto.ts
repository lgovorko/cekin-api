import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, IsUrl } from 'class-validator';

export class UserResendVerificationMailDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsUrl()
  email: string;
}

export class UserResendVerificationMailResponseDTO {
  @ApiProperty()
  message: string;
}
