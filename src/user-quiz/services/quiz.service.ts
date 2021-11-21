import { Injectable } from '@nestjs/common';
import { getRepository, getConnection, EntityManager } from 'typeorm';
import * as moment from 'moment';

import { Question } from '../../questions/entities/questions.entity';
import { UserAnswerI } from '../interfaces';
import { UserQuiz } from '../entities/user-quiz.entity';
import { UserQuizStartResponseDTO } from '../dto';
import { QuestionAnswer } from '../../question-answers/entities/question-answers.entity';
import { UserQuizStatusE } from '../enum';
import { UserDrawQualification } from '../../user-draw-qualifications/entities/user-draw-qualifications.entity';
import { QuestionsService } from '../../questions/questions.service';
import { UserDrawQualificationsHelperService } from '../../user-draw-qualifications/services';

@Injectable()
export class QuizService {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly userDrawQualificationHelperService: UserDrawQualificationsHelperService,
  ) {}

  public async start(
    userId: number,
    questionsId: number[],
    quizQuestionsCount: number,
    userDrawQualification: UserDrawQualification,
  ): Promise<UserQuizStartResponseDTO> {
    const randomQuestionId: number = await this.getRandomQuestionId(
      questionsId,
      '[]',
    );

    const question: Question = await getRepository(Question).findOne(
      randomQuestionId,
      {
        relations: ['questionAnswers'],
      },
    );

    return getConnection().transaction(async trx => {
      const newUserQuiz: UserQuiz = (await trx.save(UserQuiz, {
        userId,
        questionStartTimestamp: moment().unix(),
      })) as UserQuiz;

      const { id: userQuizId, answers, status, createdAt } = newUserQuiz;

      await trx.save(UserDrawQualification, {
        ...userDrawQualification,
        userQuizId,
        extraSpent: true,
      });

      const progress: string = this.getUserProgress(
        answers,
        quizQuestionsCount,
      );

      return {
        userQuizId,
        userId,
        progress,
        start: moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
        status: status,
        qualifications: 0,
        expired: false,
        question,
      };
    });
  }

  public async answerQuestion(
    userQuiz: UserQuiz,
    questionAnswer: QuestionAnswer,
    userDrawQualification: UserDrawQualification,
    {
      questionsCount,
      questionDuration,
    }: { questionsCount: number; questionDuration: number },
  ): Promise<UserQuizStartResponseDTO> {
    const now: moment.Moment = moment();

    const { answers, questionStartTimestamp } = userQuiz;

    const { questionId, id: answerId, correct } = questionAnswer;

    const isQuestionTimeExpired: boolean = this.checkDidQuestionTimeExpire(
      answers,
      questionDuration,
      questionStartTimestamp,
      now,
    );

    const userQuizForUpdate: UserQuiz = this.parseUserQuizAnswers(
      userQuiz,
      answers,
      {
        questionId,
        answerId,
        time: now.unix(),
        correct,
        isQuestionTimeExpired,
      },
    );

    const isUserQuizCompleted: boolean = this.checkDidUserCompleteQuiz(
      +questionsCount,
      userQuizForUpdate,
    );

    return getConnection().transaction(async (trx: EntityManager) => {
      const isQuizFinished = isUserQuizCompleted
        ? UserQuizStatusE.FINISHED
        : UserQuizStatusE.ACTIVE;

      const updatedUserQuiz: UserQuiz = (await trx.save(UserQuiz, {
        ...userQuizForUpdate,
        status: isQuizFinished,
      })) as UserQuiz;

      const { quizCorrectAnswers, qualificationsCount } = userDrawQualification;

      await trx.save(UserDrawQualification, {
        ...userDrawQualification,
        quizCorrectAnswers:
          correct && !isQuestionTimeExpired
            ? this.userDrawQualificationHelperService.incrementCorrectAnswers(
                quizCorrectAnswers,
              )
            : quizCorrectAnswers,
        qualificationsCount:
          correct && !isQuestionTimeExpired
            ? this.userDrawQualificationHelperService.incrementQualificationsCount(
                qualificationsCount,
              )
            : qualificationsCount,
        quizFinished: isUserQuizCompleted ? true : false,
      });

      const { id: userDrawQualificationId } = userDrawQualification;

      return this.nextQuestion(
        updatedUserQuiz,
        questionAnswer,
        userDrawQualificationId,
        { questionsCount, isQuestionTimeExpired, isUserQuizCompleted },
        trx,
      );
    });
  }

  private async nextQuestion(
    userQuiz: UserQuiz,
    questionAnswer: QuestionAnswer,
    userDrawQualificationId: number,
    {
      questionsCount,
      isQuestionTimeExpired,
      isUserQuizCompleted,
    }: {
      questionsCount: number;
      isQuestionTimeExpired: boolean;
      isUserQuizCompleted: boolean;
    },
    trx: EntityManager,
  ) {
    const { id, answers, userId, questionStartTimestamp, status } = userQuiz;

    const questionsId: number[] = await this.questionsService.getQuestionsId();

    const randomQuestionId: number = await this.getRandomQuestionId(
      questionsId,
      answers,
    );

    const question: Question = await trx.findOne(Question, randomQuestionId, {
      relations: ['questionAnswers'],
    });

    const progress: string = this.getUserProgress(answers, questionsCount);

    const qualifications: UserDrawQualification = await trx.findOne(
      UserDrawQualification,
      userDrawQualificationId,
    );

    const { quizCorrectAnswers } = qualifications;

    return {
      userQuizId: id,
      userId,
      progress,
      start: moment.unix(questionStartTimestamp).format('YYYY-MM-DD HH:mm:ss'),
      status,
      expired: isQuestionTimeExpired,
      qualifications: quizCorrectAnswers,
      question: !isUserQuizCompleted ? question : null,
      previousAnswer: questionAnswer,
    };
  }

  private async getRandomQuestionId(
    questionsId: number[],
    userAnswers: string,
  ): Promise<number> {
    const parsedUserAnswers: UserAnswerI[] = JSON.parse(userAnswers);

    const answeredQuestionsId: number[] = parsedUserAnswers.map(
      ({ questionId }) => questionId,
    );

    const filteredQuestionsId: number[] = questionsId.filter(
      currentValue => !answeredQuestionsId.includes(currentValue),
    );

    return this.selectRandomQuestion(filteredQuestionsId);
  }

  private checkDidQuestionTimeExpire(
    answers: string,
    questionsDuration: number,
    quizStartTime: number,
    now: moment.Moment,
  ): boolean {
    const parsedAnswers: UserAnswerI[] = JSON.parse(answers);

    if (parsedAnswers === null)
      return this.calculateQuestionExpiryTime(
        quizStartTime,
        questionsDuration,
        now,
      );

    const lastAnsweredeQuestion: UserAnswerI = parsedAnswers.reduce(
      (prev, curr) => {
        return prev.questionOrdinalNumber > curr.questionOrdinalNumber
          ? prev
          : curr;
      },
    );

    const { time: answeredQuestionTime } = lastAnsweredeQuestion;

    return this.calculateQuestionExpiryTime(
      answeredQuestionTime,
      questionsDuration,
      now,
    );
  }

  private calculateQuestionExpiryTime(
    previousAnswerTime: number,
    questionDuration: number,
    now: moment.Moment,
  ): boolean {
    const questionExpectedExpirationTime = moment
      .unix(previousAnswerTime)
      .add(questionDuration, 'seconds');
    return now.isAfter(questionExpectedExpirationTime);
  }

  private parseUserQuizAnswers(
    userQuiz: UserQuiz,
    answers: string,
    {
      questionId,
      answerId,
      time,
      correct,
      isQuestionTimeExpired,
    }: {
      questionId: number;
      answerId: number;
      time: number;
      correct: boolean;
      isQuestionTimeExpired: boolean;
    },
  ): UserQuiz {
    const userAnswersForUpdate = answers
      ? JSON.parse(answers)
      : JSON.parse('[]');

    const questionOrdinalNumber: number = userAnswersForUpdate.length + 1;

    const userAnswer = {
      questionOrdinalNumber,
      questionId,
      answerId,
      correct,
      time,
      expired: isQuestionTimeExpired,
    };

    userAnswersForUpdate.push(userAnswer);
    const stringifiedAnswers: string = JSON.stringify(userAnswersForUpdate);

    return { ...userQuiz, answers: stringifiedAnswers };
  }

  private getUserProgress(
    userAnswers: string,
    quizQuestionsCount: number,
  ): string {
    if (userAnswers === null) return `${0}/${quizQuestionsCount}`;
    const answers: UserAnswerI[] = JSON.parse(userAnswers);

    const correctAnswers: number = answers.reduce(
      (accumulator, currentValue) => {
        const { correct, expired } = currentValue;
        correct === true && !expired ? accumulator++ : accumulator;
        return accumulator;
      },
      0,
    );
    return `${correctAnswers}/${quizQuestionsCount}`;
  }

  private checkDidUserCompleteQuiz(
    questionsCount: number,
    userQuiz: UserQuiz,
  ): boolean {
    const { answers } = userQuiz;

    if (answers === null) return false;

    return JSON.parse(answers).length >= questionsCount ? true : false;
  }

  private selectRandomQuestion(questionsId: number[]): number {
    return questionsId[Math.floor(Math.random() * questionsId.length)];
  }
}
