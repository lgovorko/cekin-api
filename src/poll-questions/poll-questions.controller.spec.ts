import { Test, TestingModule } from '@nestjs/testing';
import { PollQuestionsController } from './poll-questions.controller';

describe('PollQuestionsController', () => {
  let controller: PollQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollQuestionsController],
    }).compile();

    controller = module.get<PollQuestionsController>(PollQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
