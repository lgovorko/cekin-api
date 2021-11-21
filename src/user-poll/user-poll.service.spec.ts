import { Test, TestingModule } from '@nestjs/testing';
import { UserPollService } from './user-poll.service';

describe('UserPollService', () => {
  let service: UserPollService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPollService],
    }).compile();

    service = module.get<UserPollService>(UserPollService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
