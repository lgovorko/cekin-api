import { Injectable, NotFoundException } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { identity, pickBy } from 'lodash';

import { errorMessage } from '../shared/error-messages/error-messages';
import { PollQuestionDTO } from './dto';
import { PollQuestionCreateDTO } from './dto/poll-question-create.dto';
import { PollQuestionUpdateDTO } from './dto/poll-question-update.dto';
import { PollQuestion } from './entities/poll-questions.entity';
import { PollQuestionRepository } from './poll-question.repository';

@Injectable()
export class PollQuestionsService extends TypeOrmCrudService<PollQuestion> {
  constructor(private readonly pollQuestionRepository: PollQuestionRepository) {
    super(pollQuestionRepository);
  }

  public async getPollQuestionCMS(pollQuestionId: number): Promise<any> {
    const pollQuestion: PollQuestion = await this.pollQuestionRepository.findOne(
      pollQuestionId,
      {
        relations: ['pollCategory'],
      },
    );

    if (!pollQuestion)
      throw new NotFoundException(errorMessage.pollQuestionNotFound);

    const { answers: answersForParsing } = pollQuestion;

    return { ...pollQuestion, answers: JSON.parse(answersForParsing) };
  }

  public async createPollQuestion(
    pollQuestionCreatePayload: PollQuestionCreateDTO,
  ): Promise<PollQuestionDTO> {
    const { answers: pollAnswersToStore } = pollQuestionCreatePayload;

    const newPollQuestion = await this.pollQuestionRepository.save({
      ...pollQuestionCreatePayload,
      answers: JSON.stringify(pollAnswersToStore),
    });

    const { answers } = newPollQuestion;

    return {
      ...newPollQuestion,
      answers: JSON.parse(answers),
    };
  }

  public async updatePollQuestion(
    pollQuestionId: number,
    pollQuestionUpdatePayload: PollQuestionUpdateDTO,
  ): Promise<PollQuestionDTO> {
    const pollQuestion: PollQuestion = await this.pollQuestionRepository.findOne(
      pollQuestionId,
    );

    if (!pollQuestion)
      throw new NotFoundException(errorMessage.pollQuestionNotFound);

    const { answers: answersForUpdate } = pollQuestionUpdatePayload;

    const pollQuestionToUpdate = pickBy(
      {
        ...pollQuestionUpdatePayload,
        answers: answersForUpdate && JSON.stringify(answersForUpdate),
      },
      identity,
    );

    const updatedPollQuestion: PollQuestion = await this.pollQuestionRepository.save(
      {
        ...pollQuestion,
        ...pollQuestionToUpdate,
      },
    );

    const { answers } = updatedPollQuestion;

    return {
      ...updatedPollQuestion,
      answers: JSON.parse(answers),
    };
  }
}
