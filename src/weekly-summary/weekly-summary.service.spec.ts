import { Test, TestingModule } from '@nestjs/testing';
import { WeeklySummaryService } from './weekly-summary.service';

describe('WeeklySummaryService', () => {
  let service: WeeklySummaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeeklySummaryService],
    }).compile();

    service = module.get<WeeklySummaryService>(WeeklySummaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
