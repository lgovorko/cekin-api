import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager, getConnection, getRepository } from 'typeorm';

import { PollQuestion } from '../../poll-questions/entities/poll-questions.entity';
import { errorMessage } from '../../shared/error-messages/error-messages';
import { PollCategory } from '../../poll-categories/entities/poll-categories.entity';
import { UserPollAnswerI } from '../interfaces/user-poll-answer.interface';
import { UserPoll } from '../entities/user-poll.entity';
import { PollAnswerQuestionDTO, PollDTO } from '../dto';
import { UserPollStatusE } from '../enum';
import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';
import { DailyDrawsService } from '../../daily-draws/daily-draws.service';
import { DailyDraw } from '../../daily-draws/entities/daily-draws.entity';
import { CodeTypeE } from '../../codes/enum';

@Injectable()
export class PollService {
  constructor(private readonly dailyDrawService: DailyDrawsService) {}

  public async startPoll(
    pollCategory: PollCategory,
    userId: number,
  ): Promise<PollDTO> {
    const { id: pollCategoryId } = pollCategory;

    const pollQuestions = await getRepository(PollQuestion).find({
      where: { pollCategoryId },
    });

    if (pollQuestions.length === 0)
      throw new NotFoundException(errorMessage.pollCategoryQuestionsNotFound);

    const {
      answers: questionAnswers,
      question,
      id: questionId,
      minAnswers,
      maxAnswers,
    }: PollQuestion = this.getRandomPollQuestion(pollQuestions, '[]');

    return getConnection().transaction(async trx => {
      const newUserPoll = (await trx.save(UserPoll, {
        userId,
        pollCategoryId,
      })) as UserPoll;

      const { id: userPollId, status } = newUserPoll;

      const progress = this.getUserPollProgress(
        '[]',
        this.getCategoryQuestionsCount(pollQuestions),
      );

      return {
        pollCategoryId,
        userPollId,
        userId,
        progress,
        status,
        question: {
          questionId,
          question,
          minAnswers,
          maxAnswers,
          answers: JSON.parse(questionAnswers),
        },
      };
    });
  }

  public async answerQuestion(
    userPoll: UserPoll,
    userPollAnswerPayload: PollAnswerQuestionDTO,
    pollCategory: PollCategory,
  ): Promise<PollDTO> {
    const { answers } = userPoll;

    const userPollForUpdate = this.appendNewAnswer(
      userPoll,
      answers,
      userPollAnswerPayload,
    );

    return getConnection().transaction(async trx => {
      const updatedUserPoll: UserPoll = await trx.save(
        UserPoll,
        userPollForUpdate,
      );

      return this.nextQuestion(updatedUserPoll, pollCategory, trx);
    });
  }

  public async continuePoll(
    userPoll: UserPoll,
    pollCategoryId: number,
  ): Promise<PollDTO> {
    const pollQuestions = await getRepository(PollQuestion).find({
      where: { pollCategoryId },
    });

    const { id: userPollId, userId, status, answers } = userPoll;

    const progress = this.getUserPollProgress(
      answers,
      this.getCategoryQuestionsCount(pollQuestions),
    );

    const {
      answers: questionAnswers,
      question,
      id: questionId,
      minAnswers,
      maxAnswers,
    }: PollQuestion = this.getRandomPollQuestion(pollQuestions, answers);

    return {
      pollCategoryId,
      userPollId,
      userId,
      progress,
      status,
      question: {
        questionId,
        question,
        minAnswers,
        maxAnswers,
        answers: JSON.parse(questionAnswers),
      },
    };
  }

  private async nextQuestion(
    userPoll: UserPoll,
    pollCategory: PollCategory,
    trx: EntityManager,
  ): Promise<PollDTO> {
    const {
      id: pollCategoryId,
      qualificationReward,
      extraQualification,
    } = pollCategory;

    const pollQuestions: PollQuestion[] = await trx.find(PollQuestion, {
      pollCategoryId,
    });

    const {
      id: userPollId,
      answers: userPollAnswers,
      userId,
      status,
    } = userPoll;

    const isUserPollFinished = this.checkDidUserCompletePoll(
      this.getCategoryQuestionsCount(pollQuestions),
      userPollAnswers,
    );

    const progress = this.getUserPollProgress(
      userPollAnswers,
      this.getCategoryQuestionsCount(pollQuestions),
    );

    if (isUserPollFinished)
      return this.finishPoll(
        userPoll,
        { extraQualification, progress, qualificationReward },
        trx,
      );

    const {
      answers: pollQuestionAnswers,
      question: nextPollQuestion,
      id: questionId,
      minAnswers,
      maxAnswers,
    }: PollQuestion = this.getRandomPollQuestion(
      pollQuestions,
      userPollAnswers,
    );

    return {
      pollCategoryId,
      userPollId,
      userId,
      progress,
      status,
      question: {
        questionId,
        question: nextPollQuestion,
        minAnswers,
        maxAnswers,
        answers: JSON.parse(pollQuestionAnswers),
      },
    };
  }

  private async finishPoll(
    userPoll: UserPoll,
    {
      extraQualification,
      progress,
      qualificationReward,
    }: {
      extraQualification: boolean;
      progress: string;
      qualificationReward: number;
    },
    trx: EntityManager,
  ) {
    const finishedUserPoll = await trx.save(UserPoll, {
      ...userPoll,
      status: UserPollStatusE.FINISHED,
    });

    const nextDailyDraw: DailyDraw = await this.dailyDrawService.getNextDraw();

    const { id: dailyDrawId } = nextDailyDraw;

    const { id: userPollId, userId, status, pollCategoryId } = finishedUserPoll;

    if (extraQualification)
      await trx.save(UserDrawQualification, {
        userId,
        dailyDrawId,
        userPollId,
        qualificationsCount: qualificationReward,
        type: CodeTypeE.POLL_QUALIFICATION,
      });

    return {
      pollCategoryId,
      userPollId,
      userId,
      progress,
      status,
      question: null,
    };
  }

  private appendNewAnswer(
    userPoll: UserPoll,
    previousPollAnswers: string,
    { answers, questionId }: PollAnswerQuestionDTO,
  ): UserPoll {
    const userAnswersForUpdate: any[] = previousPollAnswers
      ? JSON.parse(previousPollAnswers)
      : JSON.parse('[]');

    const questionOrdinalNumber: number = userAnswersForUpdate.length + 1;

    const userAnswer = {
      questionOrdinalNumber,
      questionId,
      answers: answers,
    };

    userAnswersForUpdate.push(userAnswer);

    const stringifiedAnswers = JSON.stringify(userAnswersForUpdate);

    return { ...userPoll, answers: stringifiedAnswers };
  }

  private getCategoryQuestionsCount(pollQuestions: PollQuestion[]): number {
    return pollQuestions.length;
  }

  private getUserPollProgress(
    userPollAnswers: string,
    numberOfQuestions: number,
  ): string {
    return userPollAnswers === null
      ? `${0}/${numberOfQuestions}`
      : `${JSON.parse(userPollAnswers).length}/${numberOfQuestions}`;
  }

  private getRandomPollQuestion(
    pollQuestions: PollQuestion[],
    userPollAnswers: string,
  ): PollQuestion {
    if (userPollAnswers === null)
      return this.selectNextPollQuestion(pollQuestions);

    const parsedUserPollQuestions: UserPollAnswerI[] = JSON.parse(
      userPollAnswers,
    );

    const parsedUserPollQuestionsId = parsedUserPollQuestions.map(
      ({ questionId }) => questionId,
    );

    const filteredPollQuestions = pollQuestions.filter(
      ({ id }) => !parsedUserPollQuestionsId.includes(id),
    );

    return this.selectNextPollQuestion(filteredPollQuestions);
  }

  private checkDidUserCompletePoll(
    questionsCount: number,
    userPollAnswers: string,
  ): boolean {
    if (userPollAnswers === null) return false;
    return JSON.parse(userPollAnswers).length >= questionsCount ? true : false;
  }

  private selectNextPollQuestion(pollQuestions: PollQuestion[]): PollQuestion {
    return pollQuestions.reduce((acc, curr) => {
      return curr.id < acc.id ? curr : acc;
    });
  }
}
