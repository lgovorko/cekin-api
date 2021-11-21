import { EntityRepository, Repository } from 'typeorm';
import { FunFact } from './entities/fun-facts.entity';

@EntityRepository(FunFact)
export class FunFactRepository extends Repository<FunFact> {}
