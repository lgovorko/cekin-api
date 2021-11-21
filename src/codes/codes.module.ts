import { Module } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeRepository } from './codes.repository';
import { Code } from './entities/codes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Code, CodeRepository])],
  providers: [CodesService],
  controllers: [CodesController],
})
export class CodesModule {}
