import { Module } from '@nestjs/common';
import { FunFactsService } from './fun-facts.service';
import { FunFactsController } from './fun-facts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FunFact } from './entities/fun-facts.entity';
import { FunFactRepository } from './fun-facts.repository';
import { RedisHelperModule } from '../redis-helpers/redis-helpers.module';

@Module({
  imports: [TypeOrmModule.forFeature([FunFact, FunFactRepository]), RedisHelperModule],
  providers: [FunFactsService],
  controllers: [FunFactsController],
})
export class FunFactsModule {}
