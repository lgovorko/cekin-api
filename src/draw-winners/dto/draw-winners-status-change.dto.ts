import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsIn } from 'class-validator';
import { DrawWinnerStatusE } from '../enum/draw-winners.enum';

export class DrawWinnerConfirm {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @IsIn([DrawWinnerStatusE.CONFIRMED])
  status: number;
}

export class DrawWinnerReject {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  @IsIn([DrawWinnerStatusE.REJECTED])
  status: number;
}
