import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  @Exclude()
  password: string;

  @ApiProperty()
  status: number;

  @ApiProperty()
  role: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  birthDate: string;

  @ApiProperty()
  gender: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  postalNumber: number;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  useTerms: boolean;

  @ApiProperty()
  privacyTerms: boolean;

  @ApiProperty()
  prizeTerms: boolean;

  @ApiProperty()
  personalTerms: boolean;

  @ApiProperty()
  advertTerms: boolean;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
