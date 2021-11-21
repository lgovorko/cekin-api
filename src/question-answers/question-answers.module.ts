import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { QuestionAnswersService } from './question-answers.service';
import { QuestionAnswersController } from './question-answers.controller';
import { QuestionAnswer } from './entities/question-answers.entity';
import { QuestionAnswerRepository } from './question-answers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionAnswer, QuestionAnswerRepository])],
  providers: [QuestionAnswersService],
  controllers: [QuestionAnswersController],
})
export class QuestionAnswersModule {}
