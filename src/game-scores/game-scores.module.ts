import { Module } from '@nestjs/common';
import { GameScoresService } from './game-scores.service';
import { GameScoresController } from './game-scores.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameScore } from './entities/game-scores.entity';
import { GameScoreRepository } from './game-scores.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameScore, GameScoreRepository])],
  providers: [GameScoresService],
  controllers: [GameScoresController],
})
export class GameScoresModule {}
