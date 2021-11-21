import { ApiProperty } from '@nestjs/swagger';

export class PrizesMainIdsDTO {
  @ApiProperty()
  id: number[];
}
