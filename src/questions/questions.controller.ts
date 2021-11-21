import {
  Controller,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Question } from './entities/questions.entity';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import {
  QuestionDTO,
  QuestionCreateDTO,
  QuestionUpdateDTO,
  QuestionsManyAnswersCreateDTO,
  QuestionsManyAnswersUpdateDTO,
} from './dto';
import { QuestionsService } from './questions.service';

@Crud({
  model: {
    type: Question,
  },
  query: {
    limit: 200,
    sort: [],
    join: {
      questionAnswers: {
        required: false,
      },
    },
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: QuestionDTO }),
      ],
      interceptors: [new TransformInterceptor(QuestionDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [QuestionDTO] }),
      ],
      interceptors: [new TransformInterceptor(QuestionDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: QuestionDTO })
  @UseInterceptors(new TransformInterceptor(QuestionDTO))
  @Post()
  createQuestion(
    @Body() questionPayload: QuestionCreateDTO,
  ): Promise<QuestionDTO> {
    return this.service.createQuestion(questionPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: QuestionDTO })
  @UseInterceptors(new TransformInterceptor(QuestionDTO))
  @Post('many')
  createQuestionManyAnswers(
    @Body() questionPayload: QuestionsManyAnswersCreateDTO,
  ): Promise<Question> {
    return this.service.createQuestionManyAnswers(questionPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: QuestionDTO })
  @UseInterceptors(new TransformInterceptor(QuestionDTO))
  @Patch(':questionId')
  updateQuestion(
    @Param('questionId') questionId: number,
    @Body() questionPayload: QuestionUpdateDTO,
  ): Promise<Question> {
    return this.service.updateQuestion(questionId, questionPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: QuestionDTO })
  @UseInterceptors(new TransformInterceptor(QuestionDTO))
  @Patch('many/:questionId')
  updateQuestionManyAnswers(
    @Param('questionId') questionId: number,
    @Body() questionPayload: QuestionsManyAnswersUpdateDTO,
  ): Promise<Question> {
    return this.service.updateQuestionManyAnswers(questionId, questionPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: QuestionDTO })
  @UseInterceptors(new TransformInterceptor(QuestionDTO))
  @Delete(':questionId')
  deleteQuestion(@Param('questionId') questionId: number): Promise<Question> {
    return this.service.deleteQuestion(questionId);
  }
}
