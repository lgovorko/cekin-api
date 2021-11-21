import {
  Controller,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  Patch,
  Param,
  Delete,
  Get,
  UploadedFile,
  Render,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { FunFact } from './entities/fun-facts.entity';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { FunFactDTO, FunFactsCreateDTO, FunFactUpdateDTO } from './dto';
import { FunFactsService } from './fun-facts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { renameFilename, imageFileFilter } from '../shared/drivers';

@Crud({
  model: {
    type: FunFact,
  },
  query: {
    limit: 200,
    sort: [],
    join: {
      prize: {
        required: false,
      },
    },
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: FunFactDTO }),
      ],
      interceptors: [new TransformInterceptor(FunFactDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [FunFactDTO] }),
      ],
      interceptors: [new TransformInterceptor(FunFactDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('fun-facts')
@Controller('fun-facts')
export class FunFactsController {
  constructor(private readonly service: FunFactsService) {}

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: FunFactDTO })
  @UseInterceptors(new TransformInterceptor(FunFactDTO))
  @Get('random')
  getRandomFunFact(): Promise<FunFact> {
    return this.service.getRandomFunFact();
  }

  @Render('fun-facts.template.hbs')
  @Get('meta/web/:funFactId')
  getFunFactMeta(
    @Param('funFactId') funFactId: number,
  ): Promise<{
    text: string;
    imagePath: string;
    domain: string;
  }> {
    return this.service.getFunFactMeta(funFactId);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: FunFactDTO })
  @UseInterceptors(new TransformInterceptor(FunFactDTO))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/images/fun-facts',
        filename: renameFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post()
  createFunFacts(
    @Body() funFactsPayload: FunFactsCreateDTO,
    @UploadedFile() imagePayload: Express.Multer.File,
  ): Promise<FunFact> {
    return this.service.createFunFact(funFactsPayload, imagePayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: FunFactDTO })
  @UseInterceptors(new TransformInterceptor(FunFactDTO))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: 'public/images/fun-facts',
        filename: renameFilename,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Patch(':funFactId')
  updateFunFact(
    @Param('funFactId') funFactId: number,
    @Body() funFactUpdatePayload: FunFactUpdateDTO,
    @UploadedFile() imagePayload: Express.Multer.File,
  ): Promise<FunFactDTO> {
    return this.service.updateFunFact(
      funFactId,
      funFactUpdatePayload,
      imagePayload,
    );
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: FunFactDTO })
  @UseInterceptors(new TransformInterceptor(FunFactDTO))
  @Delete(':funFactId')
  deleteFunFact(@Param('funFactId') funFactId: number): Promise<FunFactDTO> {
    return this.service.deleteFunFact(funFactId);
  }
}
