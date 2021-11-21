import { Module } from '@nestjs/common';
import { DrawCronService } from './draw-cron.service';
import { SettingsModule } from '../settings/settings.module';
import { DrawWinnersModule } from '../draw-winners/draw-winners.module';
import { PrizesModule } from '../prizes/prizes.module';
import { DrawCronController } from './draw-cron.controller';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    SettingsModule,
    DrawWinnersModule,
    PrizesModule,
    SettingsModule,
    LoggerModule,
  ],
  providers: [DrawCronService],
  controllers: [DrawCronController],
})
export class DrawCronModule {}
