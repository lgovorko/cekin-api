import { EntityRepository, Repository } from 'typeorm';
import { UserQuiz } from './entities/user-quiz.entity';

@EntityRepository(UserQuiz)
export class UserQuizRepository extends Repository<UserQuiz> {}
