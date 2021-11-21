import {
  Controller,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionAnswer } from './entities/question-answers.entity';
import { Crud } from '@nestjsx/crud';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  QuestionAnswerDTO,
  QuestionAnswerCreateDTO,
  QuestionAnswerUpdateDTO,
} from './dto';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { QuestionDTO } from '../questions/dto';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { QuestionAnswersService } from './question-answers.service';

@Crud({
  model: {
    type: QuestionAnswer,
  },
  query: {
    limit: 200,
    sort: [],
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: QuestionAnswerDTO }),
      ],
      interceptors: [new TransformInterceptor(QuestionAnswerDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [QuestionAnswerDTO] }),
      ],
      interceptors: [new TransformInterceptor(QuestionAnswerDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('question-answers')
@Controller('question-answers')
export class QuestionAnswersController {
  constructor(private readonly service: QuestionAnswersService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: QuestionAnswerDTO })
  @UseInterceptors(new TransformInterceptor(QuestionAnswerDTO))
  @Post()
  createQuestionAnswer(
    @Body() questionAnswerPayload: QuestionAnswerCreateDTO,
  ): Promise<QuestionAnswerDTO> {
    return this.service.createQuestionAnswer(questionAnswerPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: QuestionAnswerDTO })
  @UseInterceptors(new TransformInterceptor(QuestionAnswerDTO))
  @Patch(':questionAnswerId')
  updateQuestionAnswer(
    @Param('questionAnswerId') questionAnswerId: number,
    @Body() questionAnswerPayload: QuestionAnswerUpdateDTO,
  ): Promise<QuestionAnswerDTO> {
    return this.service.updateQuestionAnswer(
      questionAnswerId,
      questionAnswerPayload,
    );
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: QuestionAnswerDTO })
  @UseInterceptors(new TransformInterceptor(QuestionAnswerDTO))
  @Delete(':questionAnswerId')
  deleteQuestionAnswer(
    @Param('questionAnswerId') questionAnswerId: number,
  ): Promise<QuestionAnswerDTO> {
    return this.service.deleteQuestionAnswer(questionAnswerId);
  }
}
