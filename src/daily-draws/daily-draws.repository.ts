import { EntityRepository, Repository } from 'typeorm';

import { DailyDraw } from './entities/daily-draws.entity';
import { CustomDailyDrawResponseDTO } from './dto/daily-draws-custom.dto';
import { DailyDrawStatusE } from './enum';
import { DrawWinnerStatusE } from '../draw-winners/enum';
import { CodeTypeE } from '../codes/enum';

@EntityRepository(DailyDraw)
export class DailyDrawRepositry extends Repository<DailyDraw> {
	public async getDailyDrawsWithPrize(
		{ page = 1, limit = 10 }: { page: number; limit: number },
		nextDrawDate: string
	): Promise<CustomDailyDrawResponseDTO> {
		const pageInt: number = page < 1 ? 1 : page;
		const limitInt: number = limit;
		const skipped: number = (pageInt - 1) * limitInt;

		const [data, total] = await this.createQueryBuilder('dailyDraw')
			.leftJoinAndSelect('dailyDraw.prize', 'prize')
			.where(
				`dailyDraw.drawDate >= '${nextDrawDate}' AND dailyDraw.status = ${DailyDrawStatusE.ACTIVE}`
			)
			.skip(skipped)
			.take(limit)
			.orderBy('dailyDraw.drawDate', 'ASC')
			.getManyAndCount();

		const pageCount = Math.ceil(total / limitInt);

		return {
			data,
			count: limitInt,
			total,
			page: pageInt,
			pageCount,
		};
	}

	public async getDailyDrawHistory(): Promise<DailyDraw[]> {
		const dailyDrawHistory = await this.createQueryBuilder('dailyDraw')
			.leftJoinAndSelect('dailyDraw.prize', 'prize')
			.leftJoinAndSelect('dailyDraw.drawWinner', 'drawWinner')
			.leftJoinAndSelect('drawWinner.user', 'user')
			.where(
				`(dailyDraw.status = ${DailyDrawStatusE.FINISHED})
        OR
        (dailyDraw.status = ${DailyDrawStatusE.FINISHED_WITHOUT_WINNERS} AND drawWinner.id is null)`
			)
			.orderBy('dailyDraw.drawDate', 'DESC')
			.getMany();

		return dailyDrawHistory.map(currentDailyDraw => {
			const { drawWinner } = currentDailyDraw;

			const filteredDrawWinners = drawWinner.filter(
				currentDrawWinner =>
					currentDrawWinner.status === DrawWinnerStatusE.CONFIRMED
			);

			currentDailyDraw.drawWinner = filteredDrawWinners;

			return currentDailyDraw;
		});
	}

	public async getDailyDrawStats(dailyDrawId: number): Promise<any> {
		return this.query(`
            SELECT id, draw_date as drawDate,
              COALESCE((SELECT COUNT(*) FROM user_draw_qualifications WHERE daily_draw_id = ${dailyDrawId} AND type in (${CodeTypeE.GAVELINO},${CodeTypeE.CEKIN}) GROUP BY daily_draw_id), 0)::int as "codeEntry",
              COALESCE((SELECT SUM(qualifications_count)  FROM user_draw_qualifications WHERE daily_draw_id = ${dailyDrawId} GROUP BY daily_draw_id), 0)::int as "drawQualifications",
              COALESCE((SELECT COUNT(*) FROM user_draw_qualifications WHERE daily_draw_id = ${dailyDrawId} AND extra_spent = true GROUP BY daily_draw_id),0)::int as "quizStarted",
              COALESCE((SELECT COUNT(*) FROM user_draw_qualifications WHERE daily_draw_id = ${dailyDrawId} AND quiz_finished = true GROUP BY daily_draw_id),0)::int as "quizFinished",
              COALESCE((SELECT COUNT(*) FROM user_draw_qualifications WHERE is_shared = true AND daily_draw_id = ${dailyDrawId} GROUP BY daily_draw_id), 0)::int as "sharedCount"
            FROM daily_draw
            WHERE id = ${dailyDrawId};
    `);
	}
}
