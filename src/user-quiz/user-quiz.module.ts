import { Module } from '@nestjs/common';
import { UserQuizService } from './user-quiz.service';
import { UserQuizController } from './user-quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserQuiz } from './entities/user-quiz.entity';
import { QuizService } from './services/quiz.service';
import { RedisHelperModule } from '../redis-helpers/redis-helpers.module';
import { SettingsModule } from '../settings/settings.module';
import { QuestionsModule } from '../questions/questions.module';
import { DailyDrawsModule } from '../daily-draws/daily-draws.module';
import { UserDrawQualificationsModule } from '../user-draw-qualifications/user-draw-qualifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserQuiz]),
    RedisHelperModule,
    SettingsModule,
    QuestionsModule,
    DailyDrawsModule,
    UserDrawQualificationsModule
  ],
  providers: [UserQuizService, QuizService],
  controllers: [UserQuizController],
})
export class UserQuizModule {}
