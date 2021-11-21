import { Test, TestingModule } from '@nestjs/testing';
import { GameScoresController } from './game-scores.controller';

describe('GameScores Controller', () => {
  let controller: GameScoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameScoresController],
    }).compile();

    controller = module.get<GameScoresController>(GameScoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
