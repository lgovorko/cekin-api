import { PrizeDTO } from "./prize.dto";
import { ApiProperty } from "@nestjs/swagger";

export class PrizeCustomResponseDTO {
    @ApiProperty()
    data: PrizeDTO[];
  
    @ApiProperty()
    count: number;
  
    @ApiProperty()
    total: number;
  
    @ApiProperty()
    page: number;
  
    @ApiProperty()
    pageCount: number;
  }
