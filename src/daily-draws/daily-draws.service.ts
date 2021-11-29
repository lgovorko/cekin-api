import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment';
import { pickBy, identity } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import {
	getRepository,
	EntityManager,
	FindOneOptions,
	MoreThanOrEqual,
} from 'typeorm';

import { DailyDraw } from './entities/daily-draws.entity';
import { DailyDrawCreateDTO, DailyDrawDTO, DailyDrawUpdateDTO } from './dto';
import { DailyDrawRepositry } from './daily-draws.repository';
import { errorMessage } from '../shared/error-messages/error-messages';
import { CustomDailyDrawResponseDTO } from './dto/daily-draws-custom.dto';
import { PaginationI } from '../shared/interfaces';
import { Prize } from '../prizes/entities/prizes.entity';
import { SettingsService } from '../settings/settings.service';
import { PrizeStatusE } from '../prizes/enum';
import { DrawType } from './enum/draw-type.enum';

@Injectable()
export class DailyDrawsService extends TypeOrmCrudService<DailyDraw> {
	constructor(
		@InjectRepository(DailyDrawRepositry)
		private readonly dailyDrawRepository: DailyDrawRepositry,
		private readonly settingsService: SettingsService
	) {
		super(dailyDrawRepository);
	}

	public async getDailyDrawStats(dailyDrawId: number): Promise<any> {
		const dailyDraw = await this.dailyDrawRepository.findOne(dailyDrawId);

		const { type, drawDate } = dailyDraw;

		let dailyDrawStat;

		if (type === DrawType.DAILY) {
			[dailyDrawStat] = await this.dailyDrawRepository.getDailyDrawStats(
				dailyDrawId
			);
		} else {
			[dailyDrawStat] = await this.dailyDrawRepository.getWeeklyDrawStats(
				dailyDrawId,
				drawDate
			);
		}

		if (!dailyDrawStat) return [];
		return dailyDrawStat;
	}

	public async getDailyDrawHistory(): Promise<DailyDraw[]> {
		return this.dailyDrawRepository.getDailyDrawHistory();
	}

	public async getDailyDrawsWithPrize({
		page,
		limit,
	}: PaginationI): Promise<CustomDailyDrawResponseDTO> {
		const nextDrawDate = await this.getNextDrawDate();

		return this.dailyDrawRepository.getDailyDrawsWithPrize(
			{ page: +page, limit: +limit },
			nextDrawDate
		);
	}

	public async getNextDraw(trx?: EntityManager): Promise<DailyDraw> {
		const currentDate = moment().format('YYYY-MM-DD');

		const query: FindOneOptions<DailyDraw> = {
			where: {
				drawDate: MoreThanOrEqual(currentDate),
				type: DrawType.DAILY,
			},
			order: {
				drawDate: 'ASC',
			},
		};

		if (trx) return await trx.findOne(DailyDraw, query);

		return this.dailyDrawRepository.findOne(query);
	}

	private async getNextDrawDate(): Promise<string> {
		const currentDate = moment().format('YYYY-MM-DD');

		const draw: DailyDraw = await this.dailyDrawRepository.findOne({
			where: {
				drawDate: MoreThanOrEqual(currentDate),
				type: DrawType.DAILY,
			},
			order: {
				drawDate: 'ASC',
			},
		});

		return draw.drawDate;
	}

	public async getDailyDrawWithPrize(
		dailyDrawId: number
	): Promise<DailyDraw> {
		return this.dailyDrawRepository.findOne(dailyDrawId);
	}

	public async createDailyDraw(
		dailyDrawPayload: DailyDrawCreateDTO
	): Promise<DailyDrawDTO> {
		const { prizeId } = dailyDrawPayload;

		const prize: Prize = await getRepository(Prize).findOne(prizeId);

		if (!prize) throw new BadRequestException(errorMessage.prizeNotFound);

		const { status: prizeStatus } = prize;

		if (prizeStatus === PrizeStatusE.INACTIVE)
			throw new BadRequestException(errorMessage.prizeInactive);

		const { drawDate } = dailyDrawPayload;

		const dailyDrawToCreate: Partial<DailyDraw> = pickBy(
			{
				...dailyDrawPayload,
				drawDate: moment(drawDate).format('YYYY-MM-DD'),
			},
			identity
		);

		const newDailyDraw: DailyDraw = await this.dailyDrawRepository.save({
			...dailyDrawToCreate,
		});

		return newDailyDraw;
	}

	public async updateDailyDraw(
		dailyDrawId: number,
		dailyDrawPayload: DailyDrawUpdateDTO
	): Promise<DailyDrawDTO> {
		const dailyDraw: DailyDraw = await this.dailyDrawRepository.findOne(
			dailyDrawId
		);

		if (!dailyDraw)
			throw new NotFoundException(errorMessage.dailyDrawNotFound);

		const { drawDate } = dailyDrawPayload;

		const dailyDrawForUpdate: Partial<DailyDraw> = pickBy(
			{
				...dailyDrawPayload,
				drawDate: moment(drawDate).format('YYYY-MM-DD'),
			},
			identity
		);

		const updatedDailyDraw: DailyDraw = await this.dailyDrawRepository.save(
			{
				...dailyDraw,
				...dailyDrawForUpdate,
			}
		);

		return updatedDailyDraw;
	}

	public async deleteDailyDraw(dailyDrawId: number): Promise<DailyDraw> {
		const dailyDraw: DailyDraw = await this.dailyDrawRepository.findOne(
			dailyDrawId
		);

		if (!dailyDraw)
			throw new NotFoundException(errorMessage.dailyDrawNotFound);

		const removedDailyDraw: DailyDraw = await this.dailyDrawRepository.remove(
			dailyDraw
		);

		return removedDailyDraw;
	}
}
