import { ApiProperty } from '@nestjs/swagger';

export class UserQualificationTotalDTO {
  @ApiProperty()
  total: number;
}

export class UserQualificationsTotalReponseDTO {
  @ApiProperty()
  total: number;
}
