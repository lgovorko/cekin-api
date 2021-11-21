import { EntityRepository, Repository } from 'typeorm';
import { Code } from './entities/codes.entity';
import { CodeStatusE } from './enum';

@EntityRepository(Code)
export class CodeRepository extends Repository<Code> {
  public async getUsedCodesGroups({
    from,
    to,
  }: {
    from: string;
    to: string;
  }): Promise<
    {
      date: string;
      type: number;
      total: number;
    }[]
  > {
    return this.query(`
        SELECT date(updated_at) as date, type, count(*)::int as total
        FROM codes
        WHERE status = ${CodeStatusE.USED} AND (DATE(updated_at) >= '${from}' AND DATE(updated_at) <= '${to}')
        GROUP BY type, date(updated_at)
        ORDER BY date(updated_at) DESC
        `);
  }
}
