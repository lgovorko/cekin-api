import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';

import { DailyDrawsService } from './daily-draws.service';
import { DailyDrawsController } from './daily-draws.controller';
import { DailyDraw } from './entities/daily-draws.entity';
import { DailyDrawRepositry } from './daily-draws.repository';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyDraw, DailyDrawRepositry]),
    SettingsModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      db: +process.env.REDIS_DB,
      ttl: 3600,
    }),
  ],
  providers: [DailyDrawsService],
  controllers: [DailyDrawsController],
  exports: [DailyDrawsService],
})
export class DailyDrawsModule {}
