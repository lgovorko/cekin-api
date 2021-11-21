import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DrawWinnersService } from './draw-winners.service';
import { DrawWinnersController } from './draw-winners.controller';
import { DrawWinner } from './entities/draw-winners.entity';
import { DrawWinnerRepository } from './draw-winners.repository';
import { UsersModule } from '../users/users.module';
import { DrawWinnerHelperService } from './services/draw-winners-helpers.service';
import { PrizesModule } from '../prizes/prizes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DrawWinner, DrawWinnerRepository]),
    UsersModule,
    PrizesModule
  ],
  providers: [DrawWinnersService, DrawWinnerHelperService],
  controllers: [DrawWinnersController],
  exports: [DrawWinnerHelperService],
})
export class DrawWinnersModule {}
