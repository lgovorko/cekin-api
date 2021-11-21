import { UserCode } from './entities/user-code.entity';
import { Repository, EntityRepository } from 'typeorm';
import { CodeCheckDTO, UserCodeDTO } from './dto';
import { UserCodeStatusE } from './enum';

@EntityRepository(UserCode)
export class UserCodeRepository extends Repository<UserCode> {
  public async checkCode({ code }: CodeCheckDTO): Promise<UserCodeDTO[]> {
    return this.createQueryBuilder('userCode')
      .select([
        'userCode',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.username',
        'user.address',
        'user.phoneNumber',
        'user.postalNumber',
        'user.city',
        'userDrawQualification',
      ])
      .leftJoin('userCode.user', 'user')
      .leftJoin('userCode.userDrawQualification', 'userDrawQualification')
      .where(`userCode.userEntry=:code`, { code })
      .getMany();
  }

  public async getUserCodes({
    from,
    to,
  }: {
    from: string;
    to: string;
  }): Promise<{ date: string; status: number; total: number }[]> {
    return this.query(`
      SELECT DATE(created_at) as date, status, COUNT(*)::int as total
      FROM user_code
      WHERE DATE(created_at) >= '${from}' AND DATE(created_at) <= '${to}'
      GROUP BY DATE(created_at), status
      ORDER BY DATE(created_at)
      ;
    `);
  }
}
