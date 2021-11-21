import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as redisStore from 'cache-manager-redis-store';

import { PrizesService } from './prizes.service';
import { PrizesController } from './prizes.controller';
import { Prize } from './entities/prizes.entity';
import { PrizeRepository } from './prizes.repository';
import { PrizeHelperService } from './services';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prize, PrizeRepository]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      db: +process.env.REDIS_DB,
      ttl: 3600,
    }),
  ],
  providers: [PrizesService, PrizeHelperService],
  controllers: [PrizesController],
  exports: [PrizeHelperService],
})
export class PrizesModule {}
