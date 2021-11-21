import { Injectable, NotFoundException } from '@nestjs/common';
import { PrizeCreateDTO } from './dto/prizes-create.dto';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Prize } from './entities/prizes.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PrizeRepository } from './prizes.repository';
import { PrizeDTO, PrizeCustomResponseDTO } from './dto';
import { errorMessage } from '../shared/error-messages/error-messages';
import { pickBy, identity } from 'lodash';
import { removeRootDirFromPath } from '../shared/drivers';
import { PrizeUpdateDTO } from './dto/prizes-update.dto';
import { PrizeTypeE } from './enum';

@Injectable()
export class PrizesService extends TypeOrmCrudService<Prize> {
  constructor(
    @InjectRepository(PrizeRepository)
    private readonly prizeRepository: PrizeRepository,
  ) {
    super(prizeRepository);
  }

  public getMainPrizesIds(): Promise<Prize[]> {
    return this.prizeRepository.find({
      select: ['id'],
      where: {
        type: PrizeTypeE.MAIN,
      },
    });
  }

  public async getManyPrizes({
    page = '1',
    limit = '10',
  }: {
    page: string;
    limit: string;
  }): Promise<PrizeCustomResponseDTO> {
    return this.prizeRepository.getManyPrizes({ page: +page, limit: +limit });
  }

  public getPrizeDrawsAndResults(prizeId: number): Promise<Prize | []> {
    return this.prizeRepository.getPrizeDrawsAndResults(prizeId);
  }

  public async createPrize(
    prizePayload: PrizeCreateDTO,
    imagePayload: Express.Multer.File,
  ): Promise<PrizeDTO> {
    const { originalname = '', path = '' } = imagePayload ? imagePayload : {};

    const prizeToCreate = pickBy(
      {
        ...prizePayload,
        imageFilename: originalname,
        imagePath: path ? removeRootDirFromPath(path) : '',
      },
      identity,
    );

    return this.prizeRepository.save(prizeToCreate);
  }

  public async updatePrize(
    prizeId: number,
    prizePayload: PrizeUpdateDTO,
    imagePayload: Express.Multer.File,
  ): Promise<PrizeDTO> {
    const prize = await this.prizeRepository.findOne(prizeId);

    if (!prize) throw new NotFoundException(errorMessage.prizeNotFound);

    const { originalname = '', path = '' } = imagePayload ? imagePayload : {};

    const prizeForUpdate = pickBy({
      ...prizePayload,
      imageFilename: originalname,
      imagePath: path ? removeRootDirFromPath(path) : '',
    });

    const updatedPrize = await this.prizeRepository.save({
      ...prize,
      ...prizeForUpdate,
    });
    return updatedPrize;
  }

  public async deletePrize(prizeId: number): Promise<PrizeDTO> {
    const prize = await this.prizeRepository.findOne(prizeId);

    if (!prize) throw new NotFoundException(errorMessage.prizeNotFound);

    return this.prizeRepository.remove(prize);
  }
}
