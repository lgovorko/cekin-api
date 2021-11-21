import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDefined,
  IsEmail,
  IsBoolean,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Exclude, Type } from 'class-transformer';

export class UserRegisterDTO {
  @ApiProperty()
  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  birthDate: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  gender: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  postalNumber: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  @IsIn([true])
  useTerms: boolean;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  @IsIn([true])
  privacyTerms: boolean;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  @IsIn([true])
  prizeTerms: boolean;

  @ApiProperty()
  @IsDefined()
  @IsBoolean()
  @IsIn([true])
  personalTerms: boolean;

  @ApiProperty()
  @IsDefined()
  @IsOptional()
  @IsIn([true, false])
  advertTerms: boolean;
}

export class UserRegisterResponseDTO {
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
  isVerified: boolean;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  accessToken: string;

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
}
