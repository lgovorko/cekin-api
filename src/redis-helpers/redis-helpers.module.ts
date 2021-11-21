import { Module } from '@nestjs/common';
import { RedisHelperService } from './redis-helpers.service';
import { RedisInvalidCodeLockService } from './services/redis-invalid-code-lock.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  providers: [RedisHelperService, RedisInvalidCodeLockService],
  exports: [RedisHelperService, RedisInvalidCodeLockService],
})
export class RedisHelperModule {}
