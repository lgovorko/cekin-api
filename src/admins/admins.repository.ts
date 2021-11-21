import { EntityRepository, Repository } from 'typeorm';
import { Admin } from './entities/admins.entity';

@EntityRepository(Admin)
export class AdminRepository extends Repository<Admin> {}
