import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

export class ResendVerificationMailRequestDTO {
  @ApiProperty()
  @IsDefined()
  @IsEmail()
  email: string;
}

export class ResendVerificationMailResponseDTO {
  @ApiProperty()
  success: boolean;
}
