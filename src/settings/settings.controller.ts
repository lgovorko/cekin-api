import {
  Controller,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { SettingsCreateDTO, SettingsUpdateDTO, SettingsDTO } from './dto';
import { Settings } from './entities/settings.entity';
import { Crud } from '@nestjsx/crud';

@Crud({
  model: {
    type: Settings,
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
        ApiOkResponse({ type: SettingsDTO }),
      ],
      interceptors: [new TransformInterceptor(SettingsDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [SettingsDTO] }),
      ],
      interceptors: [new TransformInterceptor(SettingsDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @ApiOkResponse({ type: SettingsDTO })
  @UseInterceptors(new TransformInterceptor(SettingsDTO))
  @Get('key/web/:key')
  getSettingsWeb(@Param('key') key: string): Promise<Settings> {
    return this.service.getSettingsByKey(key);
  }

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: SettingsDTO })
  @UseInterceptors(new TransformInterceptor(SettingsDTO))
  @Post()
  createSettings(
    @Body() settingsPayload: SettingsCreateDTO,
  ): Promise<Settings> {
    return this.service.createSettings(settingsPayload);
  }

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: SettingsDTO })
  @UseInterceptors(new TransformInterceptor(SettingsDTO))
  @Patch(':settingsId')
  updateSettings(
    @Param('settingsId') settingsId: number,
    @Body() settingsPayload: SettingsUpdateDTO,
  ): Promise<Settings> {
    return this.service.updateSettings(settingsId, settingsPayload);
  }

  @Roles('SUPERADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: SettingsDTO })
  @UseInterceptors(new TransformInterceptor(SettingsDTO))
  @Delete(':settingsId')
  deleteSetting(@Param('settingsId') settingsId: number): Promise<Settings> {
    return this.service.deleteSetting(settingsId);
  }
}
