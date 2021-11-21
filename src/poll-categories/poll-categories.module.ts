import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PollCategoriesService } from './poll-categories.service';
import { PollCategoriesController } from './poll-categories.controller';
import { PollCategory } from './entities/poll-categories.entity';
import { PollCategoriesRepository } from './poll-categories.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PollCategory, PollCategoriesRepository])],
  providers: [PollCategoriesService],
  controllers: [PollCategoriesController],
  exports: [PollCategoriesService]
})
export class PollCategoriesModule {}
