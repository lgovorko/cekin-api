import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { identity, pickBy } from 'lodash';

import { CodeTypeE } from '../codes/enum';
import { errorMessage } from '../shared/error-messages/error-messages';
import {
	QualificationBoostCreateDTO,
	QualificationBoostDTO,
	QualificationBoostUpdateDTO,
} from './dto';
import { QualificationBoost } from './entities/qualification-boost.entity';
import { QualificationBoostRepository } from './qualification-boost.repository';

@Injectable()
export class QualificationBoostService extends TypeOrmCrudService<
	QualificationBoost
> {
	constructor(
		@InjectRepository(QualificationBoost)
		private readonly qualificationBoostRepository: QualificationBoostRepository
	) {
		super(qualificationBoostRepository);
	}

	public async createQualificationBoost(
		qualificationBoostPayload: QualificationBoostCreateDTO
	): Promise<QualificationBoostDTO> {
		const { codeTypes } = qualificationBoostPayload;

		if (codeTypes && !this.contains(codeTypes.split(',')))
			throw new NotFoundException(errorMessage.wrongCodeType);

		return this.qualificationBoostRepository.save({
			...qualificationBoostPayload,
		});
	}

	public async updateQualificationBoost(
		qualificationBoostId: number,
		qualificationBoostPayload: QualificationBoostUpdateDTO
	): Promise<QualificationBoostDTO> {
		const qualificationBoost = await this.qualificationBoostRepository.findOne(
			qualificationBoostId
		);

		if (!qualificationBoost)
			throw new NotFoundException(
				errorMessage.qualificationBoostNotFound
			);

		const { codeTypes } = qualificationBoostPayload;

		if (codeTypes && !this.contains(codeTypes.split(',')))
			throw new NotFoundException(errorMessage.wrongCodeType);

		const qualificationBoostToUpdate = pickBy(
			{
				...qualificationBoostPayload,
			},
			identity
		);

		return this.qualificationBoostRepository.save({
			...qualificationBoost,
			...qualificationBoostToUpdate,
		});
	}

	private contains(arr: string[]) {
		const indexArray = arr.map(currentValue =>
			[CodeTypeE.GAVELINO, CodeTypeE.CEKIN].indexOf(+currentValue)
		);
		return indexArray.indexOf(-1) === -1;
	}
}
