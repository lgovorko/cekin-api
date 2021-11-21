import { ApiProperty } from '@nestjs/swagger';

export class FunFactDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  text: string;

  @ApiProperty()
  imageFilename: string;

  @ApiProperty()
  imagePath: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  createdAt: string;
}
