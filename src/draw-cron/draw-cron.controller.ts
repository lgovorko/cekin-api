import { Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { DrawCronService } from './draw-cron.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('draw-cron')
@Controller('draw-cron')
export class DrawCronController {
  constructor(private readonly service: DrawCronService) {}

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('start')
  setCronJob(): Promise<{
    isStarted: boolean;
  }> {
    return this.service.setDailyDrawCronJob();
  }

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('remove')
  removeCronJob(): void {
    return this.service.removeCronJob();
  }

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  getCronJob(
    @Query() cronPayload: { cronName: string },
  ): {
    dailyDrawCronDate: string;
  } {
    return this.service.getCronJobs(cronPayload);
  }
}
