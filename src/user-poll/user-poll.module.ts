import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserPollService } from './user-poll.service';
import { UserPollController } from './user-poll.controller';
import { PollService } from './services';
import { UserPoll } from './entities/user-poll.entity';
import { UserPollRepository } from './user-poll.repository';
import { PollQuestionsModule } from '../poll-questions/poll-questions.module';
import { DailyDrawsModule } from '../daily-draws/daily-draws.module';
import { PollCategoriesModule } from '../poll-categories/poll-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPoll, UserPollRepository]),
    DailyDrawsModule,
    PollQuestionsModule,
    PollCategoriesModule
  ],
  providers: [UserPollService, PollService],
  controllers: [UserPollController],
})
export class UserPollModule {}
