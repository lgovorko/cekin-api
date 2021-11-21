import {
  Controller,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { UserDrawQualificationsService } from './user-draw-qualifications.service';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { UserCodeEntryDTO } from './dto/users-code-entry.dto';
import { CurrentUserId } from '../shared/decorators';
import { UserDrawQualification } from './entities/user-draw-qualifications.entity';
import {
  UserDrawQualificationShareDTO,
  UserDrawQualificationsNextDrawTotalReponseDTO,
} from './dto';
import { Crud } from '@nestjsx/crud';
import { UserDrawQualificationDTO } from './dto/user-draw-qualification.dto';
import { UserQualificationsTotalReponseDTO } from './dto/user-draw-qualifications-total.dto';

@Crud({
  model: {
    type: UserDrawQualification,
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
        ApiOkResponse({ type: UserDrawQualificationDTO }),
      ],
      interceptors: [new TransformInterceptor(UserDrawQualificationDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN', 'ADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [UserDrawQualificationDTO] }),
      ],
      interceptors: [new TransformInterceptor(UserDrawQualificationDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('user-draw-qualifications')
@Controller('user-draw-qualifications')
export class UserDrawQualificationsController {
  constructor(private readonly service: UserDrawQualificationsService) {}

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserDrawQualificationsNextDrawTotalReponseDTO })
  @UseInterceptors(
    new TransformInterceptor(UserDrawQualificationsNextDrawTotalReponseDTO),
  )
  @Get('next-draw-total/web')
  getNextDrawQualifications(
    @CurrentUserId() userId: number,
  ): Promise<UserDrawQualificationsNextDrawTotalReponseDTO> {
    return this.service.getNextDrawQualifications(userId);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserQualificationsTotalReponseDTO })
  @UseInterceptors(new TransformInterceptor(UserQualificationsTotalReponseDTO))
  @Get('total/web')
  getUserDrawQualificationsTotal(
    @CurrentUserId() userId: number,
  ): Promise<UserQualificationsTotalReponseDTO> {
    return this.service.getUserDrawQualificationsTotal(userId);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: [UserDrawQualificationDTO] })
  @UseInterceptors(new TransformInterceptor(UserDrawQualificationDTO))
  @Get('code-entry/history/web')
  getUserCodeEntryHistory(
    @CurrentUserId() userId: number,
  ): Promise<UserDrawQualificationDTO[]> {
    return this.service.getUserCodeEntryHistory(userId);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserDrawQualificationDTO })
  @UseInterceptors(new TransformInterceptor(UserDrawQualificationDTO))
  @Post('code-entry')
  createAdmin(
    @Body() codeEntryPayload: UserCodeEntryDTO,
    @CurrentUserId() userId: number,
  ): Promise<UserDrawQualification> {
    return this.service.codeEntry(userId, codeEntryPayload);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserDrawQualificationDTO })
  @UseInterceptors(new TransformInterceptor(UserDrawQualificationDTO))
  @Post('share')
  googleShare(
    @CurrentUserId() userId: string,
    @Body() sharePayload: UserDrawQualificationShareDTO,
  ): Promise<UserDrawQualificationDTO> {
    return this.service.share(+userId, sharePayload);
  }
}
