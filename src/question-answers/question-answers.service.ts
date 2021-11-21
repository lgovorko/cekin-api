import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { pickBy } from 'lodash';

import { QuestionAnswer } from './entities/question-answers.entity';
import { QuestionAnswerRepository } from './question-answers.repository';
import {
  QuestionAnswerCreateDTO,
  QuestionAnswerDTO,
  QuestionAnswerUpdateDTO,
} from './dto';
import { errorMessage } from '../shared/error-messages/error-messages';
import { getRepository } from 'typeorm';
import { Question } from '../questions/entities/questions.entity';

@Injectable()
export class QuestionAnswersService extends TypeOrmCrudService<QuestionAnswer> {
  constructor(
    @InjectRepository(QuestionAnswerRepository)
    private readonly questionAnswerRepository: QuestionAnswerRepository,
  ) {
    super(questionAnswerRepository);
  }

  public async createQuestionAnswer(
    questionAnswerPayload: QuestionAnswerCreateDTO,
  ): Promise<QuestionAnswerDTO> {
    const { questionId } = questionAnswerPayload;

    const question = await getRepository(Question).findOne(questionId);

    if (!question) throw new NotFoundException(errorMessage.questionNotFound);

    return this.questionAnswerRepository.save(questionAnswerPayload);
  }

  public async updateQuestionAnswer(
    questionAnswerId: number,
    questionAnswerPayload: QuestionAnswerUpdateDTO,
  ): Promise<QuestionAnswerDTO> {
    const questionAnswer: QuestionAnswer = await this.questionAnswerRepository.findOne(
      questionAnswerId,
    );

    const { questionId } = questionAnswerPayload;

    const question = questionId
      ? await getRepository(Question).findOne(questionId)
      : undefined;

    if (questionId && !question)
      throw new NotFoundException(errorMessage.questionNotFound);

    if (!questionAnswer)
      throw new NotFoundException(errorMessage.questionAnswerNotFound);

    const questionAnswerForUpdate = pickBy(
      questionAnswerPayload,
      x => x !== null && x !== '' && x !== undefined,
    );

    return this.questionAnswerRepository.save({
      ...questionAnswer,
      ...questionAnswerForUpdate,
    });
  }

  public async deleteQuestionAnswer(
    questionAnswerId: number,
  ): Promise<QuestionAnswerDTO> {
    const question: QuestionAnswer = await this.questionAnswerRepository.findOne(
      questionAnswerId,
    );

    if (!question)
      throw new NotFoundException(errorMessage.questionAnswerNotFound);

    return this.questionAnswerRepository.remove(question);
  }
}
