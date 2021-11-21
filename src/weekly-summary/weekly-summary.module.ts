import { Module } from '@nestjs/common';
import { WeeklySummaryService } from './weekly-summary.service';
import { WeeklySummaryController } from './weekly-summary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeeklySummary } from './entities/weekly-summary.entity';
import { WeeklySummaryRepository } from './weekly-summary.repository';
import { WeeklySummaryXlsxGeneratorService } from './services/weekly-summary-xlsx-generator.service';

@Module({
  imports: [TypeOrmModule.forFeature([WeeklySummary, WeeklySummaryRepository])],
  providers: [WeeklySummaryService, WeeklySummaryXlsxGeneratorService],
  controllers: [WeeklySummaryController],
})
export class WeeklySummaryModule {}
