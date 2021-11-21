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
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { PollQuestionDTO } from './dto';
import { PollQuestionCreateDTO } from './dto/poll-question-create.dto';
import { PollQuestionUpdateDTO } from './dto/poll-question-update.dto';
import { PollQuestion } from './entities/poll-questions.entity';
import { PollQuestionsService } from './poll-questions.service';

@Crud({
  model: {
    type: PollQuestion,
  },
  query: {
    limit: 200,
    sort: [],
    join: {
      pollCategory: {
        required: false,
      },
    },
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: PollQuestionDTO }),
      ],
      interceptors: [new TransformInterceptor(PollQuestionDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [PollQuestionDTO] }),
      ],
      interceptors: [new TransformInterceptor(PollQuestionDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('poll-questions')
@Controller('poll-questions')
export class PollQuestionsController {
  constructor(private readonly service: PollQuestionsService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PollQuestionDTO })
  @UseInterceptors(new TransformInterceptor(PollQuestionDTO))
  @Get('cms/:pollQuestionId')
  getPollQuestionCMS(
    @Param('pollQuestionId') pollQuestionId: string
  ): Promise<any> {
    return this.service.getPollQuestionCMS(+pollQuestionId)
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PollQuestionDTO })
  @UseInterceptors(new TransformInterceptor(PollQuestionDTO))
  @Post()
  createPollCategory(
    @Body() pollQuestionCreatePayload: PollQuestionCreateDTO,
  ): Promise<PollQuestionDTO> {
    return this.service.createPollQuestion(pollQuestionCreatePayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: PollQuestionDTO })
  @UseInterceptors(new TransformInterceptor(PollQuestionDTO))
  @Patch(':pollQuestionId')
  updatePollCategory(
    @Param('pollQuestionId') pollQuestionId: number,
    @Body() pollQuestionUpdatePayload: PollQuestionUpdateDTO,
  ): Promise<PollQuestionDTO> {
    return this.service.updatePollQuestion(
      pollQuestionId,
      pollQuestionUpdatePayload,
    );
  }
}
