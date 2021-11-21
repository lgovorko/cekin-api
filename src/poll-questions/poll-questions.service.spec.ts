import { Test, TestingModule } from '@nestjs/testing';
import { PollQuestionsService } from './poll-questions.service';

describe('PollQuestionsService', () => {
  let service: PollQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollQuestionsService],
    }).compile();

    service = module.get<PollQuestionsService>(PollQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
