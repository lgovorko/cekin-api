import {
	Injectable,
	BadRequestException,
	NotFoundException,
} from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import * as moment from 'moment';
import { CronJob } from 'cron';
import { times } from 'lodash';

import { DailyDraw } from '../daily-draws/entities/daily-draws.entity';
import { getRepository, getConnection } from 'typeorm';
import { UserDrawQualification } from '../user-draw-qualifications/entities/user-draw-qualifications.entity';
import { DailyDrawStatusE } from '../daily-draws/enum';
import { errorMessage } from '../shared/error-messages/error-messages';
import { DrawWinner } from '../draw-winners/entities/draw-winners.entity';
import { DrawWinnerHelperService } from '../draw-winners/services/draw-winners-helpers.service';
import { Prize } from '../prizes/entities/prizes.entity';
import { PrizeHelperService } from '../prizes/services';
import { SettingsService } from '../settings/settings.service';
import { LoggerService } from '../logger/logger.service';
import { PrizeTypeE } from '../prizes/enum';
import { CodeTypeE } from '../codes/enum';

@Injectable()
export class DrawCronService {
	constructor(
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly drawWinnerHelperService: DrawWinnerHelperService,
		private readonly prizeHelperService: PrizeHelperService,
		private readonly settingsService: SettingsService,
		private readonly loggerService: LoggerService
	) {}

	async setDailyDrawCronJob(): Promise<{
		isStarted: boolean;
	}> {
		const setting: string = await this.settingsService.getSetting(
			'drawTime'
		);

		const [hour, minutes] = setting.split(':');
		const drawTime = `${minutes} ${hour} * * *`;

		const job = new CronJob(`${drawTime}`, async () => {
			try {
				const today = moment().format('YYYY-MM-DD');

				const todayDraw: DailyDraw = await getRepository(
					DailyDraw
				).findOne({
					where: { drawDate: today },
				});

				if (!todayDraw)
					throw new BadRequestException(
						errorMessage.dailyDrawNotFound
					);

				const { id, prizeId } = todayDraw;

				const userDrawQualifications: UserDrawQualification[] = await getRepository(
					UserDrawQualification
				).find({ where: { dailyDrawId: id } });

				if (userDrawQualifications.length === 0) {
					return getRepository(DailyDraw).save({
						...todayDraw,
						status: DailyDrawStatusE.FINISHED_WITHOUT_WINNERS,
					});
				}

				const winner: {
					userDrawQualificationId: number;
					userId: number;
					dailyDrawId: number;
				} = this.drawWinnerHelperService.selectRandomUser(
					userDrawQualifications
				);

				const { userDrawQualificationId, userId, dailyDrawId } = winner;

				return getConnection().transaction(async trx => {
					const prize: Prize = await trx.findOne(Prize, prizeId);

					const { totalCount, totalSpent } = prize;

					if (totalSpent > totalCount)
						throw new BadRequestException(errorMessage.prizeSpent);

					const incrementedSpentCount = this.prizeHelperService.incrementPrizeSpentCount(
						totalSpent
					);

					await trx.save(Prize, {
						...prize,
						totalSpent: incrementedSpentCount,
					});

					await trx.save(DailyDraw, {
						...todayDraw,
						status: DailyDrawStatusE.FINISHED,
					});

					const newDrawWinner = (await trx.save(DrawWinner, {
						userId,
						userDrawQualificationId,
						prizeId,
						dailyDrawId,
					})) as DrawWinner;

					this.loggerService.log({
						userId: 0,
						url: 'DAILY DRAW LOG',
					});

					return newDrawWinner;
				});
			} catch (error) {
				this.loggerService.error({
					message: error,
					userId: 0,
					url: 'DAILY DRAW LOG',
				});
			}
		});

		this.schedulerRegistry.addCronJob('dailyDraw', job);

		this.loggerService.log({
			userId: 0,
			url: 'DAILY DRAW START LOG',
		});

		job.start();

		return { isStarted: true };
	}

	removeCronJob(): void {
		return this.schedulerRegistry.deleteCronJob('dailyDraw');
	}

	getCronJobs({
		cronName,
	}: {
		cronName: string;
	}): {
		dailyDrawCronDate: string;
	} {
		const cronData: CronJob = this.schedulerRegistry.getCronJob(
			`${cronName}`
		);
		const nextDates: Date = cronData.nextDates().toDate();
		return {
			dailyDrawCronDate: moment(nextDates).format('YYYY-MM-DD HH:mm:ss'),
		};
	}

	@Cron('* * * * *', {
		name: 'dailyDraw',
	})
	async dailyDraw() {
		try {
			const today = moment().format('YYYY-MM-DD');

			const todayDraw: DailyDraw = await getRepository(DailyDraw).findOne(
				{
					where: { drawDate: today },
				}
			);

			console.log(today, ' today');

			if (!todayDraw)
				throw new BadRequestException(errorMessage.dailyDrawNotFound);

			const { id, prizeId } = todayDraw;

			const userDrawQualifications: UserDrawQualification[] = await getRepository(
				UserDrawQualification
			).find({ where: { dailyDrawId: id } });

			if (userDrawQualifications.length === 0) {
				return getRepository(DailyDraw).save({
					...todayDraw,
					status: DailyDrawStatusE.FINISHED_WITHOUT_WINNERS,
				});
			}

			const winner: {
				userDrawQualificationId: number;
				userId: number;
				dailyDrawId: number;
			} = this.drawWinnerHelperService.selectRandomUser(
				userDrawQualifications
			);

			const { userDrawQualificationId, userId, dailyDrawId } = winner;
			console.log(winner, 'winner');

			return getConnection().transaction(async trx => {
				const prize: Prize = await trx.findOne(Prize, prizeId);

				const { totalCount, totalSpent } = prize;

				if (totalSpent > totalCount)
					throw new BadRequestException(errorMessage.prizeSpent);

				const incrementedSpentCount = this.prizeHelperService.incrementPrizeSpentCount(
					totalSpent
				);

				await trx.save(Prize, {
					...prize,
					totalSpent: incrementedSpentCount,
				});

				await trx.save(DailyDraw, {
					...todayDraw,
					status: DailyDrawStatusE.FINISHED,
				});

				const newDrawWinner = (await trx.save(DrawWinner, {
					userId,
					userDrawQualificationId,
					prizeId,
					dailyDrawId,
				})) as DrawWinner;

				this.loggerService.log({
					userId: 0,
					url: 'DAILY DRAW START LOG',
				});

				return newDrawWinner;
			});
		} catch (error) {
			this.loggerService.error({
				message: error,
				userId: 0,
				url: 'DAILY DRAW LOG',
			});
		}
	}

	// @Cron('10 12 22 12 *', {
	//   name: 'finalDraw',
	// })
	public async finalDraw() {
		try {
			const prize: Prize = await getRepository(Prize).findOne({
				where: { type: PrizeTypeE.MAIN },
			});

			const qualifiedUsers = await getConnection().query(
				`SELECT user_id, COUNT(*) as total FROM user_draw_qualifications WHERE type in (${CodeTypeE.BEZ_LAKTOZE}, ${CodeTypeE.D_VITAMIN}, ${CodeTypeE.KOZJE}) GROUP BY user_id HAVING COUNT(*) >= 10;`
			);

			const qualifiedUsersId: number[] = qualifiedUsers.map(
				({ user_id: userId }) => userId
			);

			const {
				totalSpent: prizeSpentCount,
				totalCount: prizeTotalCount,
				id: prizeId,
			} = prize;

			if (prizeSpentCount >= prizeTotalCount)
				throw new NotFoundException(errorMessage.prizeSpent);

			const drawWinners = times(prizeTotalCount, () => {
				const winnerId =
					qualifiedUsersId[
						Math.floor(Math.random() * qualifiedUsersId.length)
					];

				const drawWinner = {
					prizeId,
					userId: winnerId,
				};

				const index = qualifiedUsersId.indexOf(winnerId);
				qualifiedUsersId.splice(index, 1);

				return drawWinner;
			});

			console.log(drawWinners, ' draw winners');

			await getConnection().transaction(async trx => {
				await trx.save(DrawWinner, drawWinners);

				await trx.save(Prize, {
					...prize,
					totalSpent: prizeTotalCount,
				});
			});

			this.loggerService.log({
				userId: 0,
				url: 'FINAL DRAW LOG',
			});
		} catch (error) {
			this.loggerService.error({
				message: error,
				userId: 0,
				url: 'FINAL DRAW LOG',
			});
		}
	}
}
