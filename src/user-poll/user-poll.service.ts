import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PollCategory } from '../poll-categories/entities/poll-categories.entity';
import { errorMessage } from '../shared/error-messages/error-messages';
import { User } from '../users/entities/users.entity';
import { getRepository } from 'typeorm';
import { PollAnswerQuestionDTO, PollDTO, PollStartDTO } from './dto';
import { PollService } from './services';
import { UserPollRepository } from './user-poll.repository';
import { UserPollStatusE } from './enum';
import { PollCategoryStatusE } from '../poll-categories/enum';
import { UserCode } from '../user-code/entities/user-code.entity';
import { PollCategoriesService } from '../poll-categories/poll-categories.service';

@Injectable()
export class UserPollService {
  constructor(
    private readonly userPollRepository: UserPollRepository,
    private readonly pollService: PollService,
    private readonly pollCategoryService: PollCategoriesService,
  ) {}

  public async startUserPoll(
    userPollStartPayload: PollStartDTO,
    userId: number,
  ): Promise<PollDTO> {
    const user: User = await getRepository(User).findOne(userId);

    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const { pollCategoryId } = userPollStartPayload;

    const pollCategory = await getRepository(PollCategory).findOne(
      pollCategoryId,
    );

    if (!pollCategory)
      throw new NotFoundException(errorMessage.pollCategoryNotFound);

    const {
      status: PollCategoryStatus,
      numberOfCodesRequired,
      codeTypes,
    } = pollCategory;

    if (PollCategoryStatus === PollCategoryStatusE.LOCKED)
      throw new BadRequestException(errorMessage.pollCategoryLocked);

    const userCodes: UserCode[] = await getRepository(UserCode).find({
      where: { userId },
    });

    const totalValidUserCodes = this.pollCategoryService.numberOfValidCodesByType(
      userCodes,
      codeTypes,
    );

    if (numberOfCodesRequired > totalValidUserCodes)
      throw new BadRequestException(errorMessage.pollCategoryNotEnoughCodes);

    const userPoll = await this.userPollRepository.findOne({
      where: { userId, pollCategoryId },
    });

    if (userPoll) throw new BadRequestException(errorMessage.userPollFinished);

    return this.pollService.startPoll(pollCategory, userId);
  }

  public async answerUserPoll(
    userId: number,
    userPollId: number,
    userPollPayload: PollAnswerQuestionDTO,
  ): Promise<PollDTO> {
    const user = await getRepository(User).findOne(userId);

    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const userPoll = await this.userPollRepository.findOne({
      where: { id: userPollId, userId },
    });

    if (!userPoll) throw new NotFoundException(errorMessage.userPollNotFound);

    const { status: userPollStatus, pollCategoryId } = userPoll;

    if (userPollStatus === UserPollStatusE.FINISHED)
      throw new BadRequestException(errorMessage.userPollFinished);

    const pollCategory = await getRepository(PollCategory).findOne(
      pollCategoryId,
    );

    if (!pollCategory)
      throw new NotFoundException(errorMessage.pollCategoryNotFound);

    return this.pollService.answerQuestion(
      userPoll,
      userPollPayload,
      pollCategory,
    );
  }

  public async continueUserPoll(
    userId: number,
    pollCategoryId: number,
  ): Promise<PollDTO> {
    const user: User = await getRepository(User).findOne(userId);

    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const pollCategory = await getRepository(PollCategory).findOne(
      pollCategoryId,
    );

    if (!pollCategory)
      throw new NotFoundException(errorMessage.pollCategoryNotFound);

    const userPoll = await this.userPollRepository.findOne({
      where: { userId, pollCategoryId, status: UserPollStatusE.PENDING },
    });

    if (!userPoll)
      throw new NotFoundException(errorMessage.userPollCantContinue);

    return this.pollService.continuePoll(userPoll, pollCategoryId);
  }
}
