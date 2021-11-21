import { EntityRepository, Repository } from 'typeorm';
import { UserPoll } from './entities/user-poll.entity';

@EntityRepository(UserPoll)
export class UserPollRepository extends Repository<UserPoll> {
  getUserPoll(): Promise<any> {
    return this.query(
      `SELECT poll_category_id as "pollCategoryId", answers FROM user_poll`,
    );
  }
}
