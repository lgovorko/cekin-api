import { Test, TestingModule } from '@nestjs/testing';
import { GameScoresService } from './game-scores.service';

describe('GameScoresService', () => {
  let service: GameScoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameScoresService],
    }).compile();

    service = module.get<GameScoresService>(GameScoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
