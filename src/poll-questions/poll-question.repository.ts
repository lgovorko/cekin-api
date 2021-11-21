import { EntityRepository, Repository } from 'typeorm';
import { PollQuestion } from './entities/poll-questions.entity';

@EntityRepository(PollQuestion)
export class PollQuestionRepository extends Repository<PollQuestion> {}
