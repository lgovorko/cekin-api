import { Module, CacheModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from 'nestjs-redis';
import { ScheduleModule } from '@nestjs/schedule';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresConfig, redisConfig } from './config';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { PrizesModule } from './prizes/prizes.module';
import { MulterModule } from '@nestjs/platform-express';
import { QuestionsModule } from './questions/questions.module';
import { QuestionAnswersModule } from './question-answers/question-answers.module';
import { UserQuizModule } from './user-quiz/user-quiz.module';
import { SettingsModule } from './settings/settings.module';
import { DailyDrawsModule } from './daily-draws/daily-draws.module';
import { CodesModule } from './codes/codes.module';
import { UserDrawQualificationsModule } from './user-draw-qualifications/user-draw-qualifications.module';
import { RedisHelperModule } from './redis-helpers/redis-helpers.module';
import { FunFactsModule } from './fun-facts/fun-facts.module';
import { DrawCronModule } from './draw-cron/draw-cron.module';
import { DrawWinnersModule } from './draw-winners/draw-winners.module';
import { UserCodeModule } from './user-code/user-code.module';
import { LoggerModule } from './logger/logger.module';
import { WeeklySummaryModule } from './weekly-summary/weekly-summary.module';
import { QualificationBoostModule } from './qualification-boost/qualification-boost.module';
import { PollCategoriesModule } from './poll-categories/poll-categories.module';
import { PollQuestionsModule } from './poll-questions/poll-questions.module';
import { UserPollModule } from './user-poll/user-poll.module';
import { GameScoresModule } from './game-scores/game-scores.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(postgresConfig),
    MulterModule.register({
      dest: `${process.env.ROOT_PATH}/public`,
    }),
    ServeStaticModule.forRoot({
      rootPath: `${process.env.ROOT_PATH}/public`,
    }),
    RedisModule.register(redisConfig),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    AdminsModule,
    PrizesModule,
    QuestionsModule,
    QuestionAnswersModule,
    UserQuizModule,
    SettingsModule,
    DailyDrawsModule,
    CodesModule,
    UserDrawQualificationsModule,
    RedisHelperModule,
    FunFactsModule,
    DrawCronModule,
    DrawWinnersModule,
    UserCodeModule,
    LoggerModule,
    WeeklySummaryModule,
    QualificationBoostModule,
    PollCategoriesModule,
    PollQuestionsModule,
    UserPollModule,
    GameScoresModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
