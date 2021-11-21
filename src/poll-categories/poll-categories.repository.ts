import { EntityRepository, Repository } from 'typeorm';
import { PollCategory } from './entities/poll-categories.entity';

@EntityRepository(PollCategory)
export class PollCategoriesRepository extends Repository<PollCategory> {}
