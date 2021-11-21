import { Test, TestingModule } from '@nestjs/testing';
import { QualificationBoostController } from './qualification-boost.controller';

describe('QualificationBoost Controller', () => {
  let controller: QualificationBoostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualificationBoostController],
    }).compile();

    controller = module.get<QualificationBoostController>(QualificationBoostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
