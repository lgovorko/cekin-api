import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollQuestion } from './entities/poll-questions.entity';
import { PollQuestionRepository } from './poll-question.repository';
import { PollQuestionsController } from './poll-questions.controller';
import { PollQuestionsService } from './poll-questions.service';

@Module({
  imports: [TypeOrmModule.forFeature([PollQuestion, PollQuestionRepository])],
  controllers: [PollQuestionsController],
  providers: [PollQuestionsService],
  exports: [PollQuestionsService],
})
export class PollQuestionsModule {}
