import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { FunFact } from './entities/fun-facts.entity';
import { FunFactRepository } from './fun-facts.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { FunFactsCreateDTO, FunFactDTO, FunFactUpdateDTO } from './dto';
import { errorMessage } from '../shared/error-messages/error-messages';
import { getConnection } from 'typeorm';
import { RedisHelperService } from '../redis-helpers/redis-helpers.service';
import { removeRootDirFromPath } from '../shared/drivers';
import { pickBy, identity } from 'lodash';

@Injectable()
export class FunFactsService extends TypeOrmCrudService<FunFact> {
  constructor(
    @InjectRepository(FunFactRepository)
    private readonly funFactRepository: FunFactRepository,
    private readonly redisHelperService: RedisHelperService,
  ) {
    super(funFactRepository);
  }

  public async getRandomFunFact(): Promise<FunFactDTO> {
    const funFacts = await this.funFactRepository.find();

    if (funFacts.length === 0)
      throw new BadRequestException(errorMessage.funFactNotFound);

    const funFactsId = funFacts.map(({ id }) => id);

    const randomFunFactId =
      funFactsId[Math.floor(Math.random() * funFactsId.length)];

    const funFact: FunFact = await this.funFactRepository.findOne(
      randomFunFactId,
    );

    return funFact;
  }

  public async getFunFactMeta(
    funFactId: number,
  ): Promise<{
    text: string;
    imagePath: string;
    domain: string;
  }> {
    const funFact: FunFact = await this.funFactRepository.findOne(funFactId);

    if (!funFact) throw new BadRequestException(errorMessage.funFactNotFound);

    const { text, imagePath } = funFact;

    return { text, domain: `${process.env.DOMAIN}`, imagePath };
  }

  public async createFunFact(
    funFactPayload: FunFactsCreateDTO,
    imagePayload: Express.Multer.File,
  ): Promise<FunFact> {
    const { originalname = '', path = '' } = imagePayload ? imagePayload : {};

    const funFactToCreate: unknown = pickBy(
      {
        ...funFactPayload,
        imageFilename: originalname,
        imagePath: path ? removeRootDirFromPath(path) : '',
      },
      identity,
    ) as unknown;

    const funFactPayloadCasted = funFactToCreate as FunFactDTO;

    return getConnection().transaction(async trx => {
      const newFunFact: FunFact = (await trx.save(FunFact, {
        ...funFactPayloadCasted,
      })) as FunFact;

      const funFacts = await trx.find(FunFact);

      const funFactsId = funFacts.map(({ id }) => +id);

      await this.redisHelperService.set('funFactsId', funFactsId);

      return newFunFact;
    });
  }

  public async updateFunFact(
    funFactId: number,
    funFactUpdatePayload: FunFactUpdateDTO,
    imagePayload: Express.Multer.File,
  ): Promise<FunFactDTO> {
    const funFact: FunFact = await this.funFactRepository.findOne(funFactId);

    if (!funFact) throw new NotFoundException(errorMessage.funFactNotFound);

    const { originalname = '', path = '' } = imagePayload ? imagePayload : {};

    const funFactToCreate: unknown = pickBy(
      {
        ...funFactUpdatePayload,
        imageFilename: originalname,
        imagePath: path ? removeRootDirFromPath(path) : '',
      },
      identity,
    ) as unknown;

    const funFactPayloadCasted = funFactToCreate as FunFactDTO;

    const updatedFunFact: FunFact = await this.funFactRepository.save({
      ...funFact,
      ...funFactPayloadCasted,
    });

    return updatedFunFact;
  }

  public async deleteFunFact(funFactId: number): Promise<FunFactDTO> {
    const funFact: FunFact = await this.funFactRepository.findOne(funFactId);

    if (!funFact) throw new NotFoundException(errorMessage.funFactNotFound);

    return getConnection().transaction(async trx => {
      const deletedFunFact: FunFact = await trx.remove(FunFact, funFact);

      const questionsIdArray = await this.redisHelperService.getArrayOfNumbers(
        'funFactsId',
      );

      const updatedQuestionsId = this.redisHelperService.removeValueFromArray(
        funFactId,
        questionsIdArray,
      );

      await this.redisHelperService.set('funFactsId', updatedQuestionsId);

      return deletedFunFact;
    });
  }
}
