import { Module } from '@nestjs/common';
import { UserDrawQualificationsService } from './user-draw-qualifications.service';
import { UserDrawQualificationsController } from './user-draw-qualifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDrawQualification } from './entities/user-draw-qualifications.entity';
import { UserDrawQualificationRepository } from './user-draw-qualifications.repository';
import { DailyDrawsModule } from '../daily-draws/daily-draws.module';
import { UserDrawQualificationsHelperService } from './services';
import { RedisHelperModule } from '../redis-helpers/redis-helpers.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserDrawQualification,
      UserDrawQualificationRepository,
    ]),
    DailyDrawsModule,
    UserDrawQualificationsHelperService,
    RedisHelperModule,
    SettingsModule
  ],
  providers: [
    UserDrawQualificationsService,
    UserDrawQualificationsHelperService,
  ],
  controllers: [UserDrawQualificationsController],
  exports: [UserDrawQualificationsHelperService],
})
export class UserDrawQualificationsModule {}
