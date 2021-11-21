import {
  Controller,
  UseGuards,
  UseInterceptors,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Admin } from '../admins/entities/admins.entity';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { DrawWinnersDTO, MainDrawWinner } from './dto';
import { DrawWinnersService } from './draw-winners.service';
import { PrizeDTO } from '../prizes/dto';
import { DrawWinner } from './entities/draw-winners.entity';

@Crud({
  model: {
    type: Admin,
  },
  query: {
    limit: 200,
    sort: [],
    join: {
      user: {
        required: false,
      },
      prize: {
        required: false,
      },
      userDrawQualification: {
        required: false,
      },
      dailyDraw: {
        required: false,
      },
    },
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: DrawWinnersDTO }),
      ],
      interceptors: [new TransformInterceptor(DrawWinnersDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [DrawWinnersDTO] }),
      ],
      interceptors: [new TransformInterceptor(DrawWinnersDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('draw-winners')
@Controller('draw-winners')
export class DrawWinnersController {
  constructor(private readonly service: DrawWinnersService) {}

  // @Roles('USER')
  // @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: MainDrawWinner })
  @UseInterceptors(new TransformInterceptor(MainDrawWinner))
  @Get('main-draw')
  getDailyDrawHistory(): Promise<DrawWinner[]> {
    return this.service.getFinalDrawWinners();
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PrizeDTO })
  @UseInterceptors(new TransformInterceptor(PrizeDTO))
  @Patch('approve/:drawWinnerId')
  ConfirmWinner(
    @Param('drawWinnerId') drawWinnerId: number,
  ): Promise<DrawWinner> {
    return this.service.approveWinner(drawWinnerId);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PrizeDTO })
  @UseInterceptors(new TransformInterceptor(PrizeDTO))
  @Patch('reject/:drawWinnerId')
  rejectWinner(
    @Param('drawWinnerId') drawWinnerId: number,
  ): Promise<{ newDrawWinner: DrawWinner; rejectedDrawWinner: DrawWinner }> {
    return this.service.rejectWinner(drawWinnerId);
  }
}
