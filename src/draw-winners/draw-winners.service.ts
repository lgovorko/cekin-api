import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { DrawWinner } from './entities/draw-winners.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DrawWinnerRepository } from './draw-winners.repository';
import { errorMessage } from '../shared/error-messages/error-messages';
import { getConnection, getRepository } from 'typeorm';
import { DrawWinnerStatusE } from './enum/draw-winners.enum';
import { UserDrawQualification } from '../user-draw-qualifications/entities/user-draw-qualifications.entity';
import { DrawWinnerHelperService } from './services/draw-winners-helpers.service';
import { Prize } from '../prizes/entities/prizes.entity';
import { PrizeTypeE } from '../prizes/enum';

@Injectable()
export class DrawWinnersService extends TypeOrmCrudService<DrawWinner> {
  constructor(
    @InjectRepository(DrawWinnerRepository)
    private readonly drawWinnerRepository: DrawWinnerRepository,
    private readonly drawWinnerHelperService: DrawWinnerHelperService,
  ) {
    super(drawWinnerRepository);
  }

  public async getFinalDrawWinners(): Promise<DrawWinner[]> {
    const mainPrize: Prize = await getRepository(Prize).findOne({
      where: { type: PrizeTypeE.MAIN },
    });

    if (!mainPrize) throw new NotFoundException(errorMessage.mainPrizeNotFound);

    const { id: prizeId } = mainPrize;

    return this.drawWinnerRepository.find({
      relations: ['prize', 'user'],
      where: { prizeId, status: DrawWinnerStatusE.CONFIRMED },
    });
  }

  public async approveWinner(drawWinnerId: number): Promise<DrawWinner> {
    const drawWinner = await this.drawWinnerRepository.findOne(drawWinnerId);

    if (!drawWinner)
      throw new NotFoundException(errorMessage.drawWinnerNotFound);

    const { status } = drawWinner;

    if (status === DrawWinnerStatusE.CONFIRMED)
      throw new BadRequestException(errorMessage.drawWinnerConfirmed);
    if (status === DrawWinnerStatusE.REJECTED)
      throw new BadRequestException(errorMessage.drawWinnerRejected);

    return getConnection().transaction(async trx => {
      const confirmedWinner = await trx.save(DrawWinner, {
        ...drawWinner,
        status: DrawWinnerStatusE.CONFIRMED,
      });

      return confirmedWinner;
    });
  }

  //** reject draw winner and draw new user from qualified users */
  public async rejectWinner(
    drawWinnerId: number,
  ): Promise<{ newDrawWinner: DrawWinner; rejectedDrawWinner: DrawWinner }> {
    const drawWinner = await this.drawWinnerRepository.findOne(drawWinnerId);

    if (!drawWinner)
      throw new NotFoundException(errorMessage.drawWinnerNotFound);

    const { status, prizeId, dailyDrawId } = drawWinner;

    if (status === DrawWinnerStatusE.CONFIRMED)
      throw new BadRequestException(errorMessage.drawWinnerConfirmed);
    if (status === DrawWinnerStatusE.REJECTED)
      throw new BadRequestException(errorMessage.drawWinnerRejected);

    return getConnection().transaction(async trx => {
      const rejectedDrawWinner = await trx.save(DrawWinner, {
        ...drawWinner,
        status: DrawWinnerStatusE.REJECTED,
      });

      const userDrawQualifications: UserDrawQualification[] = await trx.find(
        UserDrawQualification,
        { where: { dailyDrawId } },
      );

      const winner: {
        userDrawQualificationId: number;
        userId: number;
        dailyDrawId: number;
      } = this.drawWinnerHelperService.selectRandomUser(userDrawQualifications);

      const { userDrawQualificationId, userId } = winner;

      const newDrawWinner = (await trx.save(DrawWinner, {
        userId,
        userDrawQualificationId,
        prizeId,
        dailyDrawId,
      })) as DrawWinner;

      const { id: newDrawWinnerId } = newDrawWinner;

      const nextDrawWinner: DrawWinner = await trx.findOne(
        DrawWinner,
        newDrawWinnerId,
        {
          relations: ['user', 'dailyDraw', 'prize'],
        },
      );

      return {
        newDrawWinner: nextDrawWinner,
        rejectedDrawWinner: rejectedDrawWinner,
      };
    });
  }
}
