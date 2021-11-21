import { Test, TestingModule } from '@nestjs/testing';
import { UserPollController } from './user-poll.controller';

describe('UserPollController', () => {
  let controller: UserPollController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPollController],
    }).compile();

    controller = module.get<UserPollController>(UserPollController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
