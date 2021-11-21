import { EntityRepository, Repository } from 'typeorm';
import { QualificationBoost } from './entities/qualification-boost.entity';

@EntityRepository(QualificationBoost)
export class QualificationBoostRepository extends Repository<
  QualificationBoost
> {}
