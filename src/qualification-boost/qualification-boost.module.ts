import { Module } from '@nestjs/common';
import { QualificationBoostService } from './qualification-boost.service';
import { QualificationBoostController } from './qualification-boost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualificationBoost } from './entities/qualification-boost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QualificationBoost])],
  providers: [QualificationBoostService],
  controllers: [QualificationBoostController],
})
export class QualificationBoostModule {}
