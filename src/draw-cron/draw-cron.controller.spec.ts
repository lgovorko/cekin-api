import { Test, TestingModule } from '@nestjs/testing';
import { DrawCronController } from './draw-cron.controller';

describe('DrawCron Controller', () => {
  let controller: DrawCronController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DrawCronController],
    }).compile();

    controller = module.get<DrawCronController>(DrawCronController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
