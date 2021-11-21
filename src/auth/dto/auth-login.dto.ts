import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, MinLength } from 'class-validator';

export class AuthLoginDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(2)
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(4)
  password: string;
}

export class AuthLoginResponseDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: number;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  accessToken: string;
}
