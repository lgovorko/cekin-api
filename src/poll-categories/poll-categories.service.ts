import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { pickBy, flatMap } from 'lodash';
import { getCustomRepository, getRepository } from 'typeorm';

import { UserPoll } from '../user-poll/entities/user-poll.entity';
import { UserPollStatusE } from '../user-poll/enum';
import { User } from '../users/entities/users.entity';
import { errorMessage } from '../shared/error-messages/error-messages';
import {
  PollCategoryCreateDTO,
  PollCategoryDTO,
  PollCategoryUpdateDTO,
  PollCategoryWebDTO,
  PollCategoryStatDTO,
} from './dto';
import { PollCategory } from './entities/poll-categories.entity';
import { PollCategoriesRepository } from './poll-categories.repository';
import { PollCategoryStatusE, UserPollCategoriesStatusE } from './enum';
import { UserPollRepository } from '../user-poll/user-poll.repository';
import { UserCode } from '../user-code/entities/user-code.entity';

@Injectable()
export class PollCategoriesService extends TypeOrmCrudService<PollCategory> {
  private userPollRepository: UserPollRepository;

  constructor(
    private readonly pollCategoryRepository: PollCategoriesRepository,
  ) {
    super(pollCategoryRepository);
    this.userPollRepository = getCustomRepository(UserPollRepository);
  }

  public async getPollCategoriesStats(
    pollCategoryId: number,
  ): Promise<PollCategoryStatDTO> {
    const pollCategory = await this.pollCategoryRepository.findOne(
      pollCategoryId,
      {
        relations: ['pollQuestions'],
      },
    );

    if (!pollCategory)
      throw new NotFoundException(errorMessage.pollCategoryNotFound);

    const { id, title, pollQuestions } = pollCategory;

    const userPoll = await getRepository(UserPoll).find({
      where: { pollCategoryId },
    });

    const userAnswers = flatMap(userPoll, userPoll =>
      JSON.parse(userPoll.answers),
    );

    const questionResults: {
      id: number;
      question: string;
      answers: {
        answer: string;
        total: number;
      }[];
    }[] = pollQuestions.map(currentPollQuestion => {
      const { id, answers, question } = currentPollQuestion;

      const parsedAnswersForQuestion = JSON.parse(answers);

      const filteredUserAnswers = userAnswers.filter(
        userAnswersCV => userAnswersCV !== null && userAnswersCV.questionId === id,
      );

      const total: {
        answer: string;
        total: number;
      }[] = parsedAnswersForQuestion.map(({ answer }, index: number) => {
        const parsedUserAnswers = filteredUserAnswers.filter(filteredUserPoll =>
          filteredUserPoll.answers.split(',').includes('' + index),
        );
        return { answer, total: parsedUserAnswers.length };
      });

      return { id, question, answers: total };
    });

    return { id, title, results: questionResults };
  }

  public async getPollCategoriesWeb(
    userId: number,
  ): Promise<PollCategoryWebDTO[]> {
    const user: User = await getRepository(User).findOne(userId);

    if (!user) throw new NotFoundException(errorMessage.userNotFound);

    const pollCategories: PollCategory[] = await this.pollCategoryRepository.find(
      { order: { ordinalNumber: 'ASC' } },
    );

    const userCodes: UserCode[] = await getRepository(UserCode).find({ where: { userId } });

    const userPolls: UserPoll[] = await getRepository(UserPoll).find({
      select: ['pollCategoryId', 'status'],
      where: { userId },
    });

    return pollCategories.map(pollCategoryCV => {
      const userPoll: UserPoll = userPolls.find(
        ({ pollCategoryId }) => pollCategoryId === pollCategoryCV.id,
      );

      const userPollStatus: UserPollCategoriesStatusE =
        userPoll && userPoll.status === UserPollStatusE.PENDING
          ? UserPollCategoriesStatusE.PENDING
          : userPoll && userPoll.status === UserPollStatusE.FINISHED
          ? UserPollCategoriesStatusE.FINISHED
          : UserPollCategoriesStatusE.TO_DO;

      const { numberOfCodesRequired, codeTypes } = pollCategoryCV;

      const totalValidTypedUserCodes: number = this.numberOfValidCodesByType(
        userCodes,
        codeTypes,
      );

      pollCategoryCV.status =
        numberOfCodesRequired > totalValidTypedUserCodes
          ? PollCategoryStatusE.NOT_ENOUGH_CODES
          : pollCategoryCV.status;

      return {
        ...pollCategoryCV,
        userPollStatus,
      };
    });
  }

  public numberOfValidCodesByType(
    userCodes: UserCode[],
    codeTypes: string,
  ): number {
    if (codeTypes === null) return userCodes.length;

    const codeTypesParsed: number[] = codeTypes
      .split(',')
      .map(currentValue => +currentValue);

    return userCodes.filter(({ codeType }) =>
      codeTypesParsed.includes(codeType),
    ).length;
  }

  public async creatPollCategory(
    pollCategoryCreatePayload: PollCategoryCreateDTO,
  ): Promise<PollCategoryDTO> {
    return await this.pollCategoryRepository.save(pollCategoryCreatePayload);
  }

  public async updatePollCategory(
    pollCategoryId: number,
    pollCategoryUpdatePayload: PollCategoryUpdateDTO,
  ): Promise<PollCategoryDTO> {
    const pollCategory = await this.pollCategoryRepository.findOne(
      pollCategoryId,
    );

    if (!pollCategory)
      throw new NotFoundException(errorMessage.pollCategoryNotFound);

    const pollCategoryForUpdate = pickBy(
      pollCategoryUpdatePayload,
      x => x !== null && x !== undefined,
    );

    return this.pollCategoryRepository.save({
      ...pollCategory,
      ...pollCategoryForUpdate,
    });
  }
}
