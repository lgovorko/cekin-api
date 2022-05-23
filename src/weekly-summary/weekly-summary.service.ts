import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getCustomRepository } from 'typeorm';
import * as moment from 'moment';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Excel = require('excel4node');
import { Response } from 'express';

import {
	WeeklySummaryCreateDTO,
	WeeklySummaryDataDTO,
	WeeklySummaryDTO,
	WeeklySummaryUpdateDTO,
} from './dto';
import { UserRepository } from '../users/users.repository';
import { WeeklySummaryRepository } from './weekly-summary.repository';
import { UserCodeRepository } from '../user-code/user-code.repository';
import { weeklySummaryDefault } from './weekly-summary.map';
import { UserCodeStatusE } from '../user-code/enum';
import { CodeRepository } from '../codes/codes.repository';
import { CodeTypeE } from '../codes/enum';
import { errorMessage } from '../shared/error-messages/error-messages';
import { pickBy } from 'lodash';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { WeeklySummary } from './entities/weekly-summary.entity';
import { WeeklySummaryXlsxGeneratorService } from './services/weekly-summary-xlsx-generator.service';

@Injectable()
export class WeeklySummaryService extends TypeOrmCrudService<WeeklySummary> {
	private usersRepository: UserRepository;
	private userCodeRepository: UserCodeRepository;
	private codeRepository: CodeRepository;

	constructor(
		@InjectRepository(WeeklySummaryRepository)
		private weeklySummaryRepository: WeeklySummaryRepository,
		private weeklySummaryXlsxGeneratorService: WeeklySummaryXlsxGeneratorService
	) {
		super(weeklySummaryRepository);
		this.usersRepository = getCustomRepository(UserRepository);
		this.userCodeRepository = getCustomRepository(UserCodeRepository);
		this.codeRepository = getCustomRepository(CodeRepository);
	}

	public async generateDailySummaryXlsx(
		{
			from = moment('2020-09-15').format('YYYY-MM-DD'),
			to = moment().format('YYYY-MM-DD'),
		}: {
			from: string;
			to: string;
		},
		res: Response
	) {
		const usersRegistrationCountByDate: {
			date: string;
			total: number;
		}[] = await this.usersRepository.getRegisiteredUserGroupedByDate({
			from,
			to,
		});

		const userCodeGroupedByDateAndStatus: {
			date: string;
			status: number;
			total: number;
		}[] = await this.userCodeRepository.getUserCodes({ from, to });

		const usedCodesGroupedByDateAndType: {
			date: string;
			type: number;
			total: number;
		}[] = await this.codeRepository.getUsedCodesGroups({ from, to });

		const weeklySummaryPartial: WeeklySummaryDTO[] = await this.weeklySummaryRepository.getWeeklySummary(
			{ from, to }
		);

		const dataForExcel = usersRegistrationCountByDate.map(
			({ date, total }) => {
				const currentDate = moment(date).format('YYYY-MM-DD');

				const userCodes = this.parseUserCodes(
					currentDate,
					userCodeGroupedByDateAndStatus
				);

				const usedCodes = this.parseUsedCodes(
					currentDate,
					usedCodesGroupedByDateAndType
				);

				let weeklySummaryPartialCurrentDay = weeklySummaryPartial.find(
					currentWeeklySummary =>
						moment(currentWeeklySummary.date).format(
							'YYYY-MM-DD'
						) === currentDate
				);

				if (!weeklySummaryPartialCurrentDay) {
					weeklySummaryPartialCurrentDay = weeklySummaryDefault as WeeklySummaryDTO;
				}

				delete weeklySummaryPartialCurrentDay.date;

				return {
					date: moment(currentDate).format('DD.MM.YYYY'),
					newUsers: total,
					...userCodes,
					...usedCodes,
					...weeklySummaryPartialCurrentDay,
				};
			}
		);

		const workBook = new Excel.Workbook({});

		const workSheet = workBook.addWorksheet('ORDER SHEET');

		const headers = [
			'Date',
			'New Users',
			'valid codes',
			'Invalid Codes',
			'Duplicate Codes',
			'orangina_s',
			'orangina_m',
			'orangina_l',
			'rouge_s',
			'rouge_m',
			'rouge_l',
			'zero_m',
			'zero_l',
			'Released Products',
			'Pct Products Available',
			'Pct Products Sold',
			'Total Followers Fb',
			'Total Followers Insta',
			'Engagement Fb',
			'engagement Insta',
			'reach Fb',
			'Reach Insta',
			'Ga Clicks',
			'Ga Impressions',
		];

		await this.weeklySummaryXlsxGeneratorService.createTable(
			workSheet,
			headers,
			dataForExcel,
			{
				startColl: 2,
				startRow: 2,
			}
		);

		return workBook.write('summary.xlsx', res);
	}

	public async getWeeklySummary({
		from = moment()
			.subtract(7, 'days')
			.format('YYYY-MM-DD'),
		to = moment().format('YYYY-MM-DD'),
	}: {
		from: string;
		to: string;
	}): Promise<WeeklySummaryDataDTO[]> {
		const usersRegistrationCountByDate: {
			date: string;
			total: number;
		}[] = await this.usersRepository.getRegisiteredUserGroupedByDate({
			from,
			to,
		});

		const userCodeGroupedByDateAndStatus: {
			date: string;
			status: number;
			total: number;
		}[] = await this.userCodeRepository.getUserCodes({ from, to });

		const usedCodesGroupedByDateAndType: {
			date: string;
			type: number;
			total: number;
		}[] = await this.codeRepository.getUsedCodesGroups({ from, to });

		const weeklySummaryPartial: WeeklySummaryDTO[] = await this.weeklySummaryRepository.getWeeklySummary(
			{ from, to }
		);

		return usersRegistrationCountByDate.map(({ date, total }) => {
			const currentDate = moment(date).format('YYYY-MM-DD');

			const userCodes = this.parseUserCodes(
				currentDate,
				userCodeGroupedByDateAndStatus
			);

			const usedCodes = this.parseUsedCodes(
				currentDate,
				usedCodesGroupedByDateAndType
			);

			let weeklySummaryPartialCurrentDay = weeklySummaryPartial.find(
				currentWeeklySummary =>
					moment(currentWeeklySummary.date).format('YYYY-MM-DD') ===
					currentDate
			);

			if (!weeklySummaryPartialCurrentDay) {
				weeklySummaryPartialCurrentDay = weeklySummaryDefault as WeeklySummaryDTO;
			}

			delete weeklySummaryPartialCurrentDay.date;

			return {
				date: currentDate,
				newUsers: total,
				...userCodes,
				...usedCodes,
				...weeklySummaryPartialCurrentDay,
			};
		});
	}

	private parseUsedCodes(
		currentDate: string,
		usedCodesGroupedByDateAndType: {
			date: string;
			type: number;
			total: number;
		}[]
	) {
		const usedCodes = usedCodesGroupedByDateAndType.filter(
			currentUsedCode =>
				moment(currentUsedCode.date).format('YYYY-MM-DD') ===
				currentDate
		);

		return usedCodes.reduce(
			(prev, curr) => {
				prev.orangina_s =
					curr.type === CodeTypeE.ORANGINA_S
						? curr.total
						: prev.orangina_s;
				prev.orangina_m =
					curr.type === CodeTypeE.ORANGINA_M
						? curr.total
						: prev.orangina_m;
				prev.orangina_l =
					curr.type === CodeTypeE.ORANGINA_L
						? curr.total
						: prev.orangina_l;
				prev.rouge_s =
					curr.type === CodeTypeE.ROUGE_S
						? curr.total
						: prev.rouge_s;
				prev.rouge_m =
					curr.type === CodeTypeE.ROUGE_M
						? curr.total
						: prev.rouge_m;
				prev.rouge_l =
					curr.type === CodeTypeE.ROUGE_L
						? curr.total
						: prev.rouge_l;
				prev.zero_m =
					curr.type === CodeTypeE.ZERO_M
						? curr.total
						: prev.zero_m;
				prev.zero_l =
					curr.type === CodeTypeE.ZERO_L
						? curr.total
						: prev.zero_l;
				
				return prev;
			},
			{
				orangina_s: 0,
				orangina_m: 0,
				orangina_l: 0,
				rouge_s: 0,
				rouge_m: 0,
				rouge_l: 0,
				zero_m: 0,
				zero_l: 0,
			}
		);
	}

	private parseUserCodes(
		currentDate: string,
		userCodeGroupedByDateAndStatus: {
			date: string;
			status: number;
			total: number;
		}[]
	) {
		const userCodes = userCodeGroupedByDateAndStatus.filter(
			currentUserCode =>
				moment(currentUserCode.date).format('YYYY-MM-DD') ===
				currentDate
		);

		return userCodes.reduce(
			(prev, curr) => {
				prev.validCodes =
					curr.status === UserCodeStatusE.VALID
						? curr.total
						: prev.validCodes;
				prev.invalidCodes =
					curr.status === UserCodeStatusE.INVALID
						? curr.total
						: prev.invalidCodes;
				prev.duplicateCodes =
					curr.status === UserCodeStatusE.DUPLICATE
						? curr.total
						: prev.duplicateCodes;
				return prev;
			},
			{
				validCodes: 0,
				invalidCodes: 0,
				duplicateCodes: 0,
			}
		);
	}

	public async createWeeklySummary(
		weeklySummaryPayload: WeeklySummaryCreateDTO
	): Promise<WeeklySummaryDTO> {
		const { date } = weeklySummaryPayload;
		return this.weeklySummaryRepository.save({
			...weeklySummaryPayload,
			date: moment(date).format('YYYY-MM-DD'),
		});
	}

	public async updateWeekySummary(
		weeklySummaryId: number,
		weeklySummaryPayload: WeeklySummaryUpdateDTO
	): Promise<WeeklySummaryDTO> {
		const weeklySummary = await this.weeklySummaryRepository.findOne(
			weeklySummaryId
		);

		if (!weeklySummary)
			throw new NotFoundException(errorMessage.weeklySummaryNotFound);

		const weeklySummaryToUpload = pickBy(
			weeklySummaryPayload,
			x => x !== null && x !== undefined
		) as WeeklySummaryDTO;

		const { date } = weeklySummaryToUpload;

		return this.weeklySummaryRepository.save({
			...weeklySummary,
			...weeklySummaryToUpload,
			date: moment(date).format('YYYY-MM-DD'),
		});
	}

	public async deleteWeeklySummary(id: number): Promise<WeeklySummaryDTO> {
		const weeklySummary = await this.weeklySummaryRepository.findOne(id);

		if (!weeklySummary)
			throw new NotFoundException(errorMessage.weeklySummaryNotFound);

		return this.weeklySummaryRepository.remove(weeklySummary);
	}
}
