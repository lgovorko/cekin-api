import { Test, TestingModule } from '@nestjs/testing';
import { PollCategoriesService } from './poll-categories.service';

describe('PollCategoriesService', () => {
  let service: PollCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollCategoriesService],
    }).compile();

    service = module.get<PollCategoriesService>(PollCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
