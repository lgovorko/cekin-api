import {
  Controller,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  CacheInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { Prize } from './entities/prizes.entity';
import { Roles } from '../auth/roles.decorator';
import {
  PrizeDTO,
  PrizeCustomResponseDTO,
  PrizeJoinDTO,
  PrizesMainIdsDTO,
} from './dto';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { RoleGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrizesService } from './prizes.service';
import { PrizeCreateDTO } from './dto/prizes-create.dto';
import { renameFilename, imageFileFilter } from '../shared/drivers/index';
import { PrizeUpdateDTO } from './dto/prizes-update.dto';

@Crud({
  model: {
    type: Prize,
  },
  query: {
    limit: 200,
    sort: [],
    join: {
      dailyDraws: {
        required: false,
      },
    },
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: PrizeDTO }),
      ],
      interceptors: [new TransformInterceptor(PrizeDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [PrizeDTO] }),
      ],
      interceptors: [new TransformInterceptor(PrizeDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('prizes')
@Controller('prizes')
export class PrizesController {
  constructor(private readonly service: PrizesService) {}

  @ApiOkResponse({ type: [PrizeDTO] })
  @UseInterceptors(CacheInterceptor)
  @UseInterceptors(new TransformInterceptor(PrizeDTO))
  @Get('web')
  getManyPrizes(
    @Query() queryPayload: { page: string; limit: string },
  ): Promise<PrizeCustomResponseDTO> {
    return this.service.getManyPrizes(queryPayload);
  }

  @ApiOkResponse({ type: [PrizesMainIdsDTO] })
  @UseInterceptors(new TransformInterceptor(PrizesMainIdsDTO))
  @Get('main/ids/web')
  async getMainPrizesIds(): Promise<Prize[]> {
    return this.service.getMainPrizesIds();
  }

  @ApiOkResponse({ type: [PrizeJoinDTO] })
  @UseInterceptors(CacheInterceptor)
  @UseInterceptors(new TransformInterceptor(PrizeJoinDTO))
  @Get('web/:prizeId')
  getPrizeDrawsAndResults(@Param('prizeId') prizeId: number): Promise<Prize | []> {
    return this.service.getPrizeDrawsAndResults(+prizeId);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PrizeDTO })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/images/prizes',
        filename: renameFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UseInterceptors(new TransformInterceptor(PrizeDTO))
  @Post()
  createPrize(
    @Body() prizePayload: PrizeCreateDTO,
    @UploadedFile() imagePayload: Express.Multer.File,
  ): Promise<PrizeDTO> {
    return this.service.createPrize(prizePayload, imagePayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PrizeDTO })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/images/prizes',
        filename: renameFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @UseInterceptors(new TransformInterceptor(PrizeDTO))
  @Patch(':prizeId')
  updatePrize(
    @Param('prizeId') prizeId: number,
    @Body() prizePayload: PrizeUpdateDTO,
    @UploadedFile() imagePayload: Express.Multer.File,
  ): Promise<PrizeDTO> {
    return this.service.updatePrize(prizeId, prizePayload, imagePayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PrizeDTO })
  @UseInterceptors(new TransformInterceptor(PrizeDTO))
  @Delete(':prizeId')
  deletePrize(@Param('prizeId') prizeId: number): Promise<PrizeDTO> {
    return this.service.deletePrize(prizeId);
  }
}
