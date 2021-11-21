import {
  Controller,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { UserQuizService } from './user-quiz.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { CurrentUserId } from '../shared/decorators';
import { UserQuizStartResponseDTO, UserQuizAnswerDTO, UserQuizStartRequestDTO, UserQuizAnswerResponseDTO } from './dto';

@ApiTags('user-quiz')
@Controller('user-quiz')
export class UserQuizController {
  constructor(private readonly service: UserQuizService) {}

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserQuizStartResponseDTO })
  @UseInterceptors(new TransformInterceptor(UserQuizStartResponseDTO))
  @Post('start')
  startUserQuiz(
    @CurrentUserId() userId: number,
    @Body() userQuizStartPayload: UserQuizStartRequestDTO
  ): Promise<UserQuizStartResponseDTO> {
    return this.service.startUserQuiz(userId, userQuizStartPayload);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserQuizAnswerResponseDTO })
  @UseInterceptors(new TransformInterceptor(UserQuizAnswerResponseDTO))
  @Patch('answer/:userQuizId')
  answerUserQuizQuestion(
    @CurrentUserId() userId: number,
    @Body() userAnswerPayload: UserQuizAnswerDTO,
    @Param('userQuizId') userQuizId: number,
  ): Promise<UserQuizAnswerResponseDTO> {
    return this.service.answerQuestion(userId, userQuizId, userAnswerPayload);
  }
}
