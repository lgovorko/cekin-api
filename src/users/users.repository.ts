import { EntityRepository, Repository } from 'typeorm';
import * as moment from 'moment';
import { User } from './entities/users.entity';
import { UserGenderE } from './enum';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public getAgeBrakedownStats(): Promise<any> {
    const now = moment();
    const month = now.format('M');
    const day = now.format('D');

    return this.query(`
      SELECT
        (SELECT count(*) FROM users WHERE DATE(birth_date) >= '1996-01-01' AND DATE(birth_date) <= '2004-01-01')::int as "16-24", 
        (SELECT count(*) FROM users WHERE DATE(birth_date) >= '1986-01-01' AND DATE(birth_date) <= '1995-01-01')::int as "25-34",
        (SELECT count(*) FROM users WHERE DATE(birth_date) >= '1976-01-01' AND DATE(birth_date) <= '1985-01-01')::int as "35-44",
        (SELECT count(*) FROM users WHERE DATE(birth_date) >= '1966-01-01' AND DATE(birth_date) <= '1975-01-01')::int as "45-54",
        (SELECT count(*) FROM users WHERE DATE(birth_date) >= '1956-01-01' AND DATE(birth_date) <= '1965-01-01')::int as "55-64",
        (SELECT count(*) FROM users WHERE DATE(birth_date) <= '1956-01-01')::int as "65+"
    `);
  }

  public async usersGenderStats(): Promise<any> {
    return this.query(`
    SELECT
      CASE WHEN gender = ${UserGenderE.NOT_DEFINED} THEN 'Not defined'
          WHEN gender = ${UserGenderE.MALE} THEN 'Male'
          WHEN gender = ${UserGenderE.FEMALE} THEN 'Female' END,
      COUNT(*)::int FROM users GROUP BY gender;
    `);
  }

  public async postalCodesCounts(): Promise<any> {
    return this.query(`
      SELECT SUBSTRING(ARRAY_TO_STRING(REGEXP_MATCHES(address, '\d{5}'), '', '') FROM 1 FOR 2) as "postal", COUNT(*)
      FROM users
      GROUP BY SUBSTRING(ARRAY_TO_STRING(REGEXP_MATCHES(address, '\d{5}'), '', '') FROM 1 FOR 2);`);
  }

  public async getUserRegistrationStats({
    from,
    to,
  }: {
    from: string;
    to: string;
  }): Promise<any> {
    return this.query(
      ` SELECT DATE(created_at), COALESCE(COUNT(*),0)::int AS registrations
        FROM users
        WHERE DATE(created_at) >= '${from}' AND DATE(created_at) <= '${to}'
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at)`,
    );
  }

  public async getRegisiteredUserGroupedByDate(
    { from, to }: { from: string; to: string }
  ): Promise<
    { date: string; total: number }[]
  > {
    return this.query(`
      SELECT DATE(created_at), count(*)::int as total
      FROM users
      WHERE DATE(created_at) >= '${from}' AND DATE(created_at) <= '${to}'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);
  }

  public async findUser({ q }: { q: string }): Promise<User[]> {
    const splitedQuery = q.split(/(?<=^\S+)\s/);
    const [firstName, lastName] = splitedQuery;
    return this.query(
      `SELECT *
      FROM users
      WHERE LOWER(username) like LOWER('%${q}%')
      OR LOWER(first_name) like LOWER('%${q}%')
      OR LOWER(last_name) like LOWER('%${q}%')
      OR (LOWER(first_name) like LOWER('%${firstName}%') AND LOWER(last_name) like LOWER('%${lastName}%'))`,
    );
  }
}
