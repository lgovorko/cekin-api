import { Test, TestingModule } from '@nestjs/testing';
import { QualificationBoostService } from './qualification-boost.service';

describe('QualificationBoostService', () => {
  let service: QualificationBoostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QualificationBoostService],
    }).compile();

    service = module.get<QualificationBoostService>(QualificationBoostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
