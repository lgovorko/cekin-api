import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class UserUpdateDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEmail()
  username: string;

  @ApiProperty()
  @IsOptional()
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
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  postalNumber: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  city: string;
}
