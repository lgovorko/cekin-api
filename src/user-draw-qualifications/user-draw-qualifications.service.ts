import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import * as moment from 'moment';
import { In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { UserDrawQualification } from './entities/user-draw-qualifications.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDrawQualificationRepository } from './user-draw-qualifications.repository';
import { errorMessage } from '../shared/error-messages/error-messages';
import { UserCodeEntryDTO } from './dto/users-code-entry.dto';
import { getRepository, getConnection } from 'typeorm';
import { Code } from '../codes/entities/codes.entity';
import { User } from '../users/entities/users.entity';
import { CodeStatusE, CodeTypeE } from '../codes/enum';
import { UserDrawQualificationTypeE } from './enum';
import {
	UserDrawQualificationDTO,
	UserDrawQualificationsNextDrawTotalReponseDTO,
} from './dto';
import { UserDrawQualificationShareDTO } from './dto/user-draw-qualifications-share.dto';
import { DailyDrawsService } from '../daily-draws/daily-draws.service';
import { DailyDraw } from '../daily-draws/entities/daily-draws.entity';
import { UserQualificationsTotalReponseDTO } from './dto/user-draw-qualifications-total.dto';
import { UserDrawQualificationsHelperService } from './services';
import { UserCode } from '../user-code/entities/user-code.entity';
import { UserCodeStatusE } from '../user-code/enum';
import { RedisInvalidCodeLockService } from '../redis-helpers/services/redis-invalid-code-lock.service';
import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/entities/settings.entity';
import { RedisHelperService } from '../redis-helpers/redis-helpers.service';
import { CodeEntryQualificationValue } from './enum/code-entry-qualificaton-value';
import { QualificationBoost } from '../qualification-boost/entities/qualification-boost.entity';

@Injectable()
export class UserDrawQualificationsService extends TypeOrmCrudService<
	UserDrawQualification
> {
	constructor(
		@InjectRepository(UserDrawQualificationRepository)
		private readonly userDrawQualificationRepository: UserDrawQualificationRepository,
		private readonly dailyDrawService: DailyDrawsService,
		private readonly userDrawQualificationHelperService: UserDrawQualificationsHelperService,
		private readonly redisInvalidCodeLockService: RedisInvalidCodeLockService,
		private readonly settingsService: SettingsService,
		private readonly redisHelperService: RedisHelperService
	) {
		super(userDrawQualificationRepository);
	}

	public async getNextDrawQualifications(
		userId: number
	): Promise<UserDrawQualificationsNextDrawTotalReponseDTO> {
		const dailyDraw: DailyDraw = await this.dailyDrawService.getNextDraw();

		const { id: dailyDrawId } = dailyDraw;

		const qualificationsTotal = await this.userDrawQualificationRepository.getNextDrawQualifications(
			userId,
			dailyDrawId
		);

		return { total: qualificationsTotal };
	}

	public async getUserDrawQualificationsTotal(
		userId: number
	): Promise<UserQualificationsTotalReponseDTO> {
		const user = await getRepository(User).findOne(userId);

		if (!user) throw new NotFoundException(errorMessage.userNotFound);

		const qualificationsTotal = await this.userDrawQualificationRepository.count(
			{
				where: {
					userId,
					type: In([CodeTypeE.GAVELINO, CodeTypeE.CEKIN]),
				},
			}
		);

		return { total: qualificationsTotal };
	}

	public async getUserCodeEntryHistory(
		userId: number
	): Promise<UserDrawQualification[]> {
		return await this.userDrawQualificationRepository.find({
			where: {
				userId,
				type: UserDrawQualificationTypeE.CODE,
			},
		});
	}

	public async share(
		userId: number,
		sharePayload: UserDrawQualificationShareDTO
	): Promise<UserDrawQualificationDTO> {
		const user: User = await getRepository(User).findOne(userId);

		if (!user) throw new BadRequestException(errorMessage.userNotFound);

		const { userDrawQualificationId } = sharePayload;

		const userDrawQualification = await this.userDrawQualificationRepository.findOne(
			userDrawQualificationId
		);

		if (!userDrawQualification)
			throw new NotFoundException(
				errorMessage.userDrawQualificationNotFound
			);

		const {
			qualificationsCount,
			extraSpent,
			isShared,
		} = userDrawQualification;

		if (extraSpent && isShared)
			throw new BadRequestException(errorMessage.alreadyShared);

		const icrementedQualificationCount = this.userDrawQualificationHelperService.incrementQualificationsCount(
			qualificationsCount
		);

		const newUserUserDrawQualification: UserDrawQualification = await this.userDrawQualificationRepository.save(
			{
				...userDrawQualification,
				qualificationsCount: icrementedQualificationCount,
				isShared: true,
			}
		);

		return newUserUserDrawQualification;
	}

	public async codeEntry(
		userId: number,
		codeEntryPayload: UserCodeEntryDTO
	): Promise<UserDrawQualification> {
		const keyLock = `LOCK-CODE-ENTRY-${userId}`;

		const lockValue = await this.redisHelperService.get(keyLock);

		if (lockValue !== null)
			throw new BadRequestException(errorMessage.invalidCodeLimit);

		const user = await getRepository(User).findOne(userId);

		if (!user) throw new NotFoundException(errorMessage.userNotFound);

		const { postalNumber } = user;

		const { code: userCode } = codeEntryPayload;
		const gameCode = await getRepository(Code).findOne({
			where: { code: userCode },
		});

		if (!gameCode) await this.codeNotFound(userId, userCode);

		const { status, code, type } = gameCode;

		if (status === CodeStatusE.USED) {
			await getRepository(UserCode).save({
				userId,
				userEntry: userCode,
				status: UserCodeStatusE.DUPLICATE,
			});

			throw new BadRequestException(errorMessage.codeAlreadyUsed);
		}

		const nextDailyDraw: DailyDraw = await this.dailyDrawService.getNextDraw();

		const { id: dailyDrawId } = nextDailyDraw;

		const qualificationsCount = await this.codeEntryQualificationValue(
			type,
			postalNumber
		);

		const newUserDrawQualification = await getConnection().transaction(
			async trx => {
				const { id: usrId } = user;
				const newUserCode: UserCode = (await trx.save(UserCode, {
					userId,
					code,
					userEntry: userCode,
					status: UserCodeStatusE.VALID,
					codeType: type,
				})) as UserCode;

				const { id: userCodeId } = newUserCode;

				const newUserDrawQualification: UserDrawQualification = (await trx.save(
					UserDrawQualification,
					{
						dailyDrawId,
						userId: usrId,
						code,
						userCodeId,
						type: UserDrawQualificationTypeE.CODE,
						qualificationsCount,
					}
				)) as UserDrawQualification;

				await trx.save(Code, {
					...gameCode,
					status: CodeStatusE.USED,
				});

				return newUserDrawQualification;
			}
		);

		return { ...newUserDrawQualification };
	}

	private async codeEntryQualificationValue(
		codeType: number,
		userPostalNumber: number
	): Promise<number> {
		const now = moment().toISOString();

		if (!userPostalNumber) return CodeEntryQualificationValue.DEFAULT;

		const qualificationBoost = await getRepository(
			QualificationBoost
		).findOne({
			where: {
				startDateTime: LessThanOrEqual(now),
				endDateTime: MoreThanOrEqual(now),
				minPostalNumber: LessThanOrEqual(userPostalNumber),
				maxPostalNumber: MoreThanOrEqual(userPostalNumber),
			},
		});

		if (qualificationBoost)
			return this.checkCodeType(qualificationBoost, codeType);

		return CodeEntryQualificationValue.DEFAULT;
	}

	private checkCodeType(
		qualificationBoost: QualificationBoost,
		type: number
	): number {
		const { numberOfQualifications, codeTypes } = qualificationBoost;

		const ct = codeTypes
			.split(',')
			.map(currentCodeType => +currentCodeType);

		return ct.includes(type)
			? numberOfQualifications + 1
			: CodeEntryQualificationValue.DEFAULT;
	}

	private async codeNotFound(
		userId: number,
		userCode: string
	): Promise<void> {
		await getRepository(UserCode).save({
			userId,
			userEntry: userCode,
			status: UserCodeStatusE.INVALID,
		});

		const settingsInvalidCode: Settings = await this.settingsService.getSettingsByKey(
			'invalidCode'
		);

		const { value: invalidCode } = settingsInvalidCode;

		const [
			invalidCodeEntryLimit,
			invalidCodeEntryInterval,
			invalidCodeEntryLockInterval,
		] = invalidCode.split('|');

		await this.redisInvalidCodeLockService.checkInvalidCodeEntryLimit(
			userId,
			{
				invalidCodeEntryLimit: +invalidCodeEntryLimit,
				invalidCodeEntryInterval: +invalidCodeEntryInterval,
				invalidCodeEntryLockInterval: +invalidCodeEntryLockInterval,
			}
		);

		throw new NotFoundException(errorMessage.codeNotFound);
	}
}
