import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { CodesService } from './codes.service';
import { CustomCodesDTO } from './dto';

@Controller('codes')
export class CodesController {
  constructor(private readonly service: CodesService) {}

  @ApiOkResponse({ type: CustomCodesDTO })
  @UseInterceptors(new TransformInterceptor(CustomCodesDTO))
  @Get('used/types')
  getUsedCodesGroups(): Promise<any> {
    return this.service.getUsedCodesGroups();
  }
}
