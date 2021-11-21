import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { ApiOkResponse } from '@nestjs/swagger';

import { RoleGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { QualificationBoost } from './entities/qualification-boost.entity';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { QualificationBoostDTO, QualificationBoostUpdateDTO } from './dto';
import { QualificationBoostCreateDTO } from './dto/qualification-boost-create.dto';
import { QualificationBoostService } from './qualification-boost.service';
@Crud({
  model: {
    type: QualificationBoost,
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
        ApiOkResponse({ type: QualificationBoostDTO }),
      ],
      interceptors: [new TransformInterceptor(QualificationBoostDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [QualificationBoostDTO] }),
      ],
      interceptors: [new TransformInterceptor(QualificationBoostDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@Controller('qualification-boost')
export class QualificationBoostController {
  constructor(private readonly service: QualificationBoostService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: [QualificationBoostDTO] })
  @UseInterceptors(new TransformInterceptor(QualificationBoostDTO))
  @Post()
  createQualificationBoost(
    @Body() qualificationBoostPayload: QualificationBoostCreateDTO,
  ): Promise<QualificationBoostDTO> {
    return this.service.createQualificationBoost(qualificationBoostPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: [QualificationBoostDTO] })
  @UseInterceptors(new TransformInterceptor(QualificationBoostDTO))
  @Patch(':id')
  updateQualificationBoost(
    @Param(':id') qualificationBoostId: number,
    @Body() qualificationBoostPayload: QualificationBoostUpdateDTO,
  ): Promise<QualificationBoostDTO> {
    return this.service.updateQualificationBoost(
      qualificationBoostId,
      qualificationBoostPayload,
    );
  }
}
