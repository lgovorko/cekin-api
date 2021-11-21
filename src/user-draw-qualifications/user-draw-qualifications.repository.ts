import { EntityRepository, Repository } from 'typeorm';
import { UserDrawQualification } from './entities/user-draw-qualifications.entity';

@EntityRepository(UserDrawQualification)
export class UserDrawQualificationRepository extends Repository<
  UserDrawQualification
> {
  public async getNextDrawQualifications(
    userId: number,
    dailyDrawId: number,
  ): Promise<number> {
    const { sum } = await this.createQueryBuilder('userDrawQualifications')
      .select('SUM("qualifications_count")')
      .where('user_id=:userId AND daily_draw_id=:dailyDrawId', {
        userId,
        dailyDrawId,
      })
      .getRawOne();
    const castedSum = +sum;
    return castedSum;
  }

  public async getUserDrawQualificationsTotalQuery(
    userId: number,
  ): Promise<number> {
    const { sum } = await this.createQueryBuilder('userDrawQualifications')
      .select('SUM("qualifications_count")')
      .where('user_id=:userId', {
        userId,
      })
      .getRawOne();

    const castedSum = +sum;
    return castedSum;
  }
}
