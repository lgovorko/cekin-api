import { EntityRepository, Repository } from 'typeorm';
import { Prize } from './entities/prizes.entity';
import { PrizeCustomResponseDTO } from './dto/prizes-custom-response.dto';
import { DrawWinnerStatusE } from '../draw-winners/enum';
import { PrizeStatusE } from './enum';

@EntityRepository(Prize)
export class PrizeRepository extends Repository<Prize> {
	public async getManyPrizes({
		page,
		limit,
	}: {
		page: number;
		limit: number;
	}): Promise<PrizeCustomResponseDTO> {
		const pageInt: number = page < 1 ? 1 : page;
		const limitInt: number = +limit;

		const skipped: number = (pageInt - 1) * limitInt;

		const [data, total] = await this.createQueryBuilder('prize')
			.where(`prize.status = ${PrizeStatusE.ACTIVE}`)
			.skip(skipped)
			.take(limit)
			.orderBy('prize.id', 'ASC')
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

	public async getPrizeDrawsAndResults(prizeId: number): Promise<Prize | []> {
		const prize = await this.createQueryBuilder('prize')
			.leftJoinAndSelect('prize.dailyDraws', 'dailyDraws')
			.leftJoinAndSelect('dailyDraws.drawWinner', 'drawWinner')
			.leftJoinAndSelect('drawWinner.user', 'user')
			.where(`prize.id=:prizeId`, { prizeId })
			.orderBy('dailyDraws.drawDate', 'ASC')
			.getOne();
		console.log(prize, ' prize');
		if (!prize) return [];

		const { dailyDraws } = prize;

		const filteredRejectedWinners = dailyDraws.map(currentDailyDraw => {
			const { drawWinner } = currentDailyDraw;

			const filteredDrawWinners = drawWinner.filter(
				currentDrawWinner =>
					currentDrawWinner.status === DrawWinnerStatusE.CONFIRMED
			);

			currentDailyDraw.drawWinner = filteredDrawWinners;
			return currentDailyDraw;
		});

		prize.dailyDraws = filteredRejectedWinners;

		return prize;
	}
}
