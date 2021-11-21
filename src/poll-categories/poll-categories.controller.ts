import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { Roles } from '../auth/roles.decorator';
import {
  PollCategoryCreateDTO,
  PollCategoryDTO,
  PollCategoryUpdateDTO,
  PollCategoryWebDTO,
  PollCategoryStatDTO
} from './dto';
import { PollCategory } from './entities/poll-categories.entity';
import { PollCategoriesService } from './poll-categories.service';
import { CurrentUserId } from '../shared/decorators';

@Crud({
  model: {
    type: PollCategory,
  },
  query: {
    limit: 200,
    sort: [],
    join: {
      pollQuestions: {
        required: false
      }
    },
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: PollCategoryDTO }),
      ],
      interceptors: [new TransformInterceptor(PollCategoryDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [PollCategoryDTO] }),
      ],
      interceptors: [new TransformInterceptor(PollCategoryDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('poll-categories')
@Controller('poll-categories')
export class PollCategoriesController {
  constructor(private readonly service: PollCategoriesService) {}

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PollCategoryDTO })
  @UseInterceptors(new TransformInterceptor(PollCategoryDTO))
  @Get('web')
  getPollCategoriesWeb(
    @CurrentUserId() userId: number,
  ): Promise<PollCategoryWebDTO[]> {
    return this.service.getPollCategoriesWeb(userId);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PollCategoryDTO })
  @UseInterceptors(new TransformInterceptor(PollCategoryDTO))
  @Get('stats/:pollCategoryId')
  getPollCategoriesStats(
    @Param('pollCategoryId') pollCategoryId: string
  ): Promise<PollCategoryStatDTO> {
    return this.service.getPollCategoriesStats(+pollCategoryId);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PollCategoryDTO })
  @UseInterceptors(new TransformInterceptor(PollCategoryDTO))
  @Post()
  createPollCategory(
    @Body() pollCategoryCreatePayload: PollCategoryCreateDTO,
  ): Promise<PollCategoryDTO> {
    return this.service.creatPollCategory(pollCategoryCreatePayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PollCategoryDTO })
  @UseInterceptors(new TransformInterceptor(PollCategoryDTO))
  @Patch(':pollCategoryId')
  updatePollCategory(
    @Param('pollCategoryId') pollCategoryId: number,
    @Body() pollCategoryUpdatePayload: PollCategoryUpdateDTO,
  ): Promise<PollCategoryDTO> {
    return this.service.updatePollCategory(
      pollCategoryId,
      pollCategoryUpdatePayload,
    );
  }
}
