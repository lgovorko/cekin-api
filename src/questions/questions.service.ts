import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { getConnection, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Question } from './entities/questions.entity';
import { QuestionRepository } from './questions.repository';
import {
  QuestionDTO,
  QuestionCreateDTO,
  QuestionUpdateDTO,
  QuestionsManyAnswersCreateDTO,
} from './dto';
import { errorMessage } from '../shared/error-messages/error-messages';
import { RedisHelperService } from '../redis-helpers/redis-helpers.service';
import { QuestionAnswer } from '../question-answers/entities/question-answers.entity';
import { QuestionStatusE } from './enum';

@Injectable()
export class QuestionsService extends TypeOrmCrudService<Question> {
  constructor(
    @InjectRepository(QuestionRepository)
    private readonly questionRepository: QuestionRepository,
    private readonly redisHelperService: RedisHelperService,
  ) {
    super(questionRepository);
  }

  public async getQuestionsId(): Promise<number[]> {
    const questionsId = await this.redisHelperService.getArrayOfNumbers(
      'questionsId',
    );

    if (questionsId !== null) return questionsId;

    const questions: Question[] = await this.questionRepository.find({
      where: { status: QuestionStatusE.ACTIVE },
    });

    const newQuestionsId = questions.map(({ id }) => id);

    await this.redisHelperService.set('questionsId', newQuestionsId);

    return newQuestionsId;
  }

  public async createQuestion(
    createQuestionPayload: QuestionCreateDTO,
  ): Promise<QuestionDTO> {
    return getConnection().transaction(async trx => {
      const newQuestion: Question = (await trx.save(
        Question,
        createQuestionPayload,
      )) as Question;

      const questions: Question[] = await trx.find(Question);

      const questionsId = questions.map(({ id }) => id);

      await this.redisHelperService.set('questionsId', questionsId);

      return newQuestion;
    });
  }

  public async createQuestionManyAnswers(
    createQuestionPayload: QuestionsManyAnswersCreateDTO,
  ): Promise<Question> {
    return getConnection().transaction(async trx => {
      const { questionAnswers } = createQuestionPayload;
      delete createQuestionPayload.questionAnswers;

      const newQuestion: Question = (await trx.save(
        Question,
        createQuestionPayload,
      )) as Question;

      const { id: questionId } = newQuestion;

      const answersToInsert: {
        questionId: number;
        answer: string;
        correct: boolean;
      }[] = questionAnswers.map(currentValue => ({
        ...currentValue,
        questionId,
      }));

      const newQuestionAnswers: QuestionAnswer[] = (await trx.save(
        QuestionAnswer,
        answersToInsert,
      )) as QuestionAnswer[];

      newQuestion.questionAnswers = newQuestionAnswers;

      const questions: Question[] = await trx.find(Question);

      const questionsId: number[] = questions.map(({ id }) => id);

      await this.redisHelperService.set('questionsId', questionsId);

      return newQuestion;
    });
  }

  public async updateQuestionManyAnswers(
    questionId: number,
    createQuestionPayload: QuestionsManyAnswersCreateDTO,
  ): Promise<Question> {
    const questionForUpdate: Question = await this.questionRepository.findOne(
      questionId,
    );

    if (!questionForUpdate)
      throw new BadRequestException(errorMessage.questionNotFound);

    const { questionAnswers } = createQuestionPayload;
    delete createQuestionPayload.questionAnswers;

    return getConnection().transaction(async (trx: EntityManager) => {
      const updatedQuestion: Question = (await trx.save(Question, {
        ...questionForUpdate,
        ...createQuestionPayload,
      })) as Question;
      const { id } = updatedQuestion;

      if (questionAnswers)
        (await trx.save(QuestionAnswer, questionAnswers)) as QuestionAnswer[];

      updatedQuestion.questionAnswers = await trx.find(QuestionAnswer, {
        questionId: id,
      });

      return updatedQuestion;
    });
  }

  public async updateQuestion(
    questionId: number,
    questionPayload: QuestionUpdateDTO,
  ): Promise<Question> {
    const question: Question = await this.questionRepository.findOne(
      questionId,
    );

    if (!question) throw new NotFoundException(errorMessage.questionNotFound);

    return this.questionRepository.save({ ...question, ...questionPayload });
  }

  public async deleteQuestion(questionId: number): Promise<Question> {
    const question = await this.questionRepository.findOne(questionId);

    if (!question) throw new NotFoundException(errorMessage.questionNotFound);

    return getConnection().transaction(async trx => {
      const removedQuestion: Question = (await trx.remove(
        Question,
        question,
      )) as Question;

      const questionsIdArray = await this.redisHelperService.getArrayOfNumbers(
        'questionsId',
      );

      const updatedQuestionsId = this.redisHelperService.removeValueFromArray(
        questionId,
        questionsIdArray,
      );

      await this.redisHelperService.set('questionsId', updatedQuestionsId);
      return removedQuestion;
    });
  }
}
