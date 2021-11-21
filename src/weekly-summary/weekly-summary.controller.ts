import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Response } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  WeeklySummaryCreateDTO,
  WeeklySummaryDataDTO,
  WeeklySummaryDTO,
  WeeklySummaryUpdateDTO,
} from './dto';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { WeeklySummaryService } from './weekly-summary.service';
import { WeeklySummary } from './entities/weekly-summary.entity';

@Crud({
  model: {
    type: WeeklySummary,
  },
  query: {
    limit: 200,
    sort: [],
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: WeeklySummaryDTO }),
      ],
      interceptors: [new TransformInterceptor(WeeklySummaryDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [WeeklySummaryDTO] }),
      ],
      interceptors: [new TransformInterceptor(WeeklySummaryDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('weekly-summary')
@Controller('weekly-summary')
export class WeeklySummaryController {
  constructor(private readonly service: WeeklySummaryService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('xlsx')
  generateDailySummaryXlsx(@Query() { from, to }: any, @Res() res: Response) {
    return this.service.generateDailySummaryXlsx({ from, to }, res);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: [WeeklySummaryDataDTO] })
  @UseInterceptors(new TransformInterceptor(WeeklySummaryDataDTO))
  @Get('stats')
  getWeeklySummary(
    @Query() query: { from: string; to: string },
  ): Promise<WeeklySummaryDataDTO[]> {
    return this.service.getWeeklySummary(query);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: WeeklySummaryDTO })
  @UseInterceptors(new TransformInterceptor(WeeklySummaryDTO))
  @Post()
  createWeeklySummary(
    @Body() weeklySummaryPayload: WeeklySummaryCreateDTO,
  ): Promise<WeeklySummaryDTO> {
    return this.service.createWeeklySummary(weeklySummaryPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: WeeklySummaryDTO })
  @UseInterceptors(new TransformInterceptor(WeeklySummaryDTO))
  @Patch(':id')
  updateWeeklySummary(
    @Body() weeklySummaryPayload: WeeklySummaryUpdateDTO,
    @Param('id') id: string,
  ): Promise<WeeklySummaryDTO> {
    return this.service.updateWeekySummary(+id, weeklySummaryPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: WeeklySummaryDTO })
  @UseInterceptors(new TransformInterceptor(WeeklySummaryDTO))
  @Delete(':id')
  deleteWeeklySummary(@Param('id') id: string): Promise<WeeklySummaryDTO> {
    return this.service.deleteWeeklySummary(+id);
  }
}
