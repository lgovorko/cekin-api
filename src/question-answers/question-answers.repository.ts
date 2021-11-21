import { EntityRepository, Repository } from 'typeorm';
import { QuestionAnswer } from './entities/question-answers.entity';

@EntityRepository(QuestionAnswer)
export class QuestionAnswerRepository extends Repository<QuestionAnswer> {}
