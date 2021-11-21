import { Test, TestingModule } from '@nestjs/testing';
import { WeeklySummaryController } from './weekly-summary.controller';

describe('WeeklySummary Controller', () => {
  let controller: WeeklySummaryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeeklySummaryController],
    }).compile();

    controller = module.get<WeeklySummaryController>(WeeklySummaryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
