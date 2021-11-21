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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUserId } from '../shared/decorators';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { UserQuizStartResponseDTO } from '../user-quiz/dto';
import { PollAnswerQuestionDTO, PollDTO, PollStartDTO } from './dto';
import { UserPollService } from './user-poll.service';

@ApiTags('user-poll')
@Controller('user-poll')
export class UserPollController {
  constructor(private readonly service: UserPollService) {}

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserQuizStartResponseDTO })
  @UseInterceptors(new TransformInterceptor(UserQuizStartResponseDTO))
  @Post('start')
  startUserPoll(
    @Body() userPollStartPayload: PollStartDTO,
    @CurrentUserId() userId: number,
  ): Promise<PollDTO> {
    return this.service.startUserPoll(userPollStartPayload, userId);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserQuizStartResponseDTO })
  @UseInterceptors(new TransformInterceptor(UserQuizStartResponseDTO))
  @Patch('answer/:userPollId')
  answerUserPoll(
    @Param('userPollId') userPollId: string,
    @Body() userPollPayload: PollAnswerQuestionDTO,
    @CurrentUserId() userId: number,
  ): Promise<PollDTO> {
    return this.service.answerUserPoll(
      userId,
      +userPollId,
      userPollPayload,
    );
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserQuizStartResponseDTO })
  @UseInterceptors(new TransformInterceptor(UserQuizStartResponseDTO))
  @Get('continue/:pollCategoryId')
  continueUserPoll(
    @Param('pollCategoryId') pollCategoryId: string,
    @CurrentUserId() userId: number,
  ): Promise<PollDTO> {
    return this.service.continueUserPoll(userId, +pollCategoryId);
  }
}
