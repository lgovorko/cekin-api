import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from './entities/questions.entity';
import { QuestionRepository } from './questions.repository';
import { RedisHelperModule } from '../redis-helpers/redis-helpers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, QuestionRepository]),
    RedisHelperModule,
  ],
  providers: [QuestionsService],
  controllers: [QuestionsController],
  exports: [QuestionsService],
})
export class QuestionsModule {}
