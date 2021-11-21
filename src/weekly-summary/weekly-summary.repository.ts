import { EntityRepository, Repository } from 'typeorm';
import { WeeklySummaryDTO } from './dto';
import { WeeklySummary } from './entities/weekly-summary.entity';

@EntityRepository(WeeklySummary)
export class WeeklySummaryRepository extends Repository<WeeklySummary> {
  getWeeklySummary({ from, to }: { from: string; to: string }): Promise<WeeklySummaryDTO[]> {
    return this.query(`
            SELECT
              date,
              released_products as "releasedProducts",
              pct_products_available as "pctProductsAvailable",
              pct_products_sold as "pctProductsSold",
              total_followers_fb as "totalFollowersFb",
              total_followers_insta as "totalFollowersInsta",
              engagement_fb as "engagementFb",
              engagement_insta as "engagementInsta",
              reach_fb as "reachFb",
              reach_insta as "reachInsta",
              ga_clicks as "gaClicks",
              ga_impressions as "gaImpressions"
            FROM weekly_summary
            WHERE date >= '${from}' AND date <= '${to}'
        `);
  }
}
