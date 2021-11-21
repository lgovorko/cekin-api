import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './entities/settings.entity';
import { SettingsRepository } from './settings.repository';
import { RedisHelperModule } from '../redis-helpers/redis-helpers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Settings, SettingsRepository]), RedisHelperModule],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService]
})
export class SettingsModule {}
