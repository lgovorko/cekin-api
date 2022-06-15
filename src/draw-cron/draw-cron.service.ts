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
import { getRepository, getConnection, MoreThan } from 'typeorm';
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
import { UserDrawQualificationTypeE } from '../user-draw-qualifications/enum';
import { DrawType } from '../daily-draws/enum/draw-type.enum';

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

	@Cron('59 23 * * *', {
		name: 'dailyDraw',
	})
	async dailyDraw() {
		try {
			const today = moment().format('YYYY-MM-DD');

			const todayDraw: DailyDraw = await getRepository(DailyDraw).findOne(
				{
					where: { drawDate: today, type: DrawType.DAILY },
				}
			);

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

	// @Cron('58 23 * * SUN', {
	// 	name: 'weeklyDraw',
	// })
	async weeklyDraw() {
		try {
			const today = moment().format('YYYY-MM-DD');

			const todayDraw: DailyDraw = await getRepository(DailyDraw).findOne(
				{
					where: { drawDate: today, type: DrawType.WEEKLY },
				}
			);

			console.log(today, todayDraw, ' today');

			if (!todayDraw)
				throw new BadRequestException(errorMessage.dailyDrawNotFound);

			const { prizeId, status } = todayDraw;

			if (status !== DailyDrawStatusE.ACTIVE) {
				throw new BadRequestException(errorMessage.weeklyDrawNotActive);
			}

			const todayMoment = moment();

			const startOfPreviousWeek = todayMoment
				.startOf('isoWeek')
				.format('YYYY-MM-DD');

			const endOfPreviousWeek = todayMoment
				.endOf('isoWeek')
				.format('YYYY-MM-DD');

			const userDrawQualifications: UserDrawQualification[] = await getRepository(
				UserDrawQualification
			).query(`
				SELECT user_id as "userId", count(*)
				FROM user_draw_qualifications
				WHERE date(created_at) >= '${startOfPreviousWeek}' and date(created_at) <= '${endOfPreviousWeek}'
				GROUP BY user_id HAVING count(*) >= 3
			`);

			if (userDrawQualifications.length === 0) {
				return getRepository(DailyDraw).save({
					...todayDraw,
					status: DailyDrawStatusE.FINISHED_WITHOUT_WINNERS,
				});
			}

			const winner =
				userDrawQualifications[
					Math.floor(Math.random() * userDrawQualifications.length)
				];

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
					userId: winner.userId,
					dailyDrawId: todayDraw.id,
					prizeId,
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

	// @Cron('50 23 * * *', {
	// 	name: 'finalDraw',
	// })
	public async finalDraw() {
		try {
			const prizes: Prize[] = await getRepository(Prize).find({
				where: { type: PrizeTypeE.MAIN },
			});
			console.log(prizes, ' prizes');
			const qualifiedUsers = await getConnection().query(
				`SELECT udq.user_id, COUNT(*) as total FROM user_draw_qualifications as udq inner join user_code as uc on udq.user_code_id=uc.id
				 WHERE udq.type in (${UserDrawQualificationTypeE.CODE}) and uc.status = 1 GROUP BY udq.user_id HAVING COUNT(*) >= 10;`
			);

			const qualifiedUsersId: number[] = qualifiedUsers.map(
				({ user_id: userId }) => userId
			);

			for (let i = 0, len = prizes.length; i < len; i++) {
				const prize = prizes[i];

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

				await getConnection().transaction(async trx => {
					await trx.save(DrawWinner, drawWinners);

					await trx.save(Prize, {
						...prize,
						totalSpent: prizeTotalCount,
					});
				});
			}

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
