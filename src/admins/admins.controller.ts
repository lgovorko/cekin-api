import {
  Controller,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Admin } from './entities/admins.entity';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { AdminDTO, AdminCreateDTO, AdminUpdateDTO } from './dto';
import { AdminsService } from './admins.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RoleGuard } from '../auth/roles.guard';

@Crud({
  model: {
    type: Admin,
  },
  query: {
    limit: 200,
    sort: [],
  },
  routes: {
    getOneBase: {
      decorators: [
        Roles('SUPERADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: AdminDTO }),
      ],
      interceptors: [new TransformInterceptor(AdminDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [AdminDTO] }),
      ],
      interceptors: [new TransformInterceptor(AdminDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly service: AdminsService) {}

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: AdminDTO })
  @UseInterceptors(new TransformInterceptor(AdminDTO))
  @Post()
  createAdmin(@Body() adminPayload: AdminCreateDTO): Promise<AdminDTO> {
    return this.service.createAdmin(adminPayload);
  }

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: AdminDTO })
  @UseInterceptors(new TransformInterceptor(AdminDTO))
  @Patch(':adminId')
  updateAdmin(
    @Param('adminId') adminId: number,
    @Body() adminPayload: AdminUpdateDTO,
  ): Promise<AdminDTO> {
    return this.service.updateAdmin(adminId, adminPayload);
  }

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: AdminDTO })
  @UseInterceptors(new TransformInterceptor(AdminDTO))
  @Delete(':adminId')
  deleteAdmin(@Param('adminId') adminId: number): Promise<AdminDTO> {
    return this.service.deleteAdmin(adminId);
  }
}
