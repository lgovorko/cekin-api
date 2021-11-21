import { EntityRepository, Repository } from 'typeorm';
import { GameScoreLeaderboardDTO } from './dto';
import { GameScore } from './entities/game-scores.entity';

@EntityRepository(GameScore)
export class GameScoreRepository extends Repository<GameScore> {
  public getLeaderboard({
    from,
    to,
  }: {
    from: string;
    to: string;
  }): Promise<GameScoreLeaderboardDTO> {
    return this.query(`
            SELECT RANK() OVER (ORDER BY score DESC)::int as rank, username, email, score, DATE(created_at) as "createdAt"
            FROM game_scores
            WHERE (DATE(created_at) >= '${from}' AND DATE(created_at) <= '${to}') AND score is not null
            LIMIT 10
        `);
  }
}
