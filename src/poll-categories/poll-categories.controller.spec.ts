import { Test, TestingModule } from '@nestjs/testing';
import { PollCategoriesController } from './poll-categories.controller';

describe('PollCategoriesController', () => {
  let controller: PollCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollCategoriesController],
    }).compile();

    controller = module.get<PollCategoriesController>(PollCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
