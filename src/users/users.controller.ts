import {
  Controller,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  Get,
  Query,
  Render,
  Patch,
  Param,
} from '@nestjs/common';
import { Crud } from '@nestjsx/crud';
import { Roles } from '../auth/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/roles.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminDTO } from '../admins/dto';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { User } from './entities/users.entity';
import { UserDTO, UserRegistrationStatsDTO } from './dto';
import { UsersService } from './users.service';
import { UserQueryPayloadI } from './interfaces/users-query-payload.dto';

import {
  UserResendVerificationMailDTO,
  UserResendVerificationMailResponseDTO,
} from './dto/users-resend-verification-mail.dto';
import { CurrentUserId } from '../shared/decorators';
import { UserUpdateDTO } from './dto/users-update.dto';
import {
  ResetUserPasswordRequestDTO,
  ResetUserPasswordResponseDTO,
} from './dto/resend-user-password.dto';

@Crud({
  model: {
    type: User,
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
        ApiOkResponse({ type: UserDTO }),
      ],
      interceptors: [new TransformInterceptor(UserDTO)],
    },
    getManyBase: {
      decorators: [
        Roles('SUPERADMIN'),
        UseGuards(JwtAuthGuard, RoleGuard),
        ApiOkResponse({ type: [AdminDTO] }),
      ],
      interceptors: [new TransformInterceptor(UserDTO)],
    },
    only: ['getOneBase', 'getManyBase'],
  },
})
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserDTO })
  @UseInterceptors(new TransformInterceptor(UserDTO))
  @Get('find')
  findUser(@Query() queryPayload: { q: string }): Promise<User[]> {
    return this.service.findUser(queryPayload);
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('age-brakedown/stats')
  getAgeBrakedownStats(): Promise<any> {
    return this.service.getAgeBrakedownStats();
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('postal/stats')
  postalCodesCount(): Promise<any> {
    return this.service.postalCodesCount();
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('gender/stats')
  usersGenderStats(): Promise<any> {
    return this.service.usersGenderStats();
  }

  @Roles('SUPERADMIN', 'ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: [UserRegistrationStatsDTO] })
  @UseInterceptors(new TransformInterceptor(UserRegistrationStatsDTO))
  @Get('registration/stats')
  getUserRegistrationStats(
    @Query() queryPayload: { from: string; to: string },
  ): Promise<any> {
    return this.service.getUserRegistrationStats(queryPayload);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserDTO })
  @UseInterceptors(new TransformInterceptor(UserDTO))
  @Get('web')
  getUser(@CurrentUserId() userId: number): Promise<UserDTO> {
    return this.service.getUser(userId);
  }

  @Render('mail-verification.template.hbs')
  @Get('mail-verification')
  async userVerification(
    @Query() queryPayload: UserQueryPayloadI,
  ): Promise<{ message: string; imagePath: string }> {
    return this.service.verifyUser(queryPayload);
  }

  @ApiOkResponse({ type: UserResendVerificationMailResponseDTO })
  @UseInterceptors(
    new TransformInterceptor(UserResendVerificationMailResponseDTO),
  )
  @Post('resend/verification/mail')
  resendVerificationMail(
    @Body() resendVerificationMailPayload: UserResendVerificationMailDTO,
  ): Promise<UserResendVerificationMailResponseDTO> {
    return this.service.resendVerificationMail(resendVerificationMailPayload);
  }

  @ApiOkResponse({ type: UserResendVerificationMailResponseDTO })
  @UseInterceptors(
    new TransformInterceptor(UserResendVerificationMailResponseDTO),
  )
  @Post('reset-password/web')
  resetUserPassword(
    @Body() resetUserPasswordPayload: ResetUserPasswordRequestDTO,
  ): Promise<ResetUserPasswordResponseDTO> {
    return this.service.resetUserPassword(resetUserPasswordPayload);
  }

  @Render('default.template.hbs')
  @ApiOkResponse({ type: UserResendVerificationMailResponseDTO })
  @UseInterceptors(
    new TransformInterceptor(UserResendVerificationMailResponseDTO),
  )
  @Get('confirm-new-password/:salt')
  resetPasswordConfirm(
    @Param('salt') salt: string,
  ): Promise<{
    imagePath: string;
    message: string;
  }> {
    return this.service.resetPasswordConfirm(salt);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: UserDTO })
  @UseInterceptors(new TransformInterceptor(UserDTO))
  @Patch('web')
  upateUser(
    @Body() updateUserPayload: UserUpdateDTO,
    @CurrentUserId() userId: number,
  ): Promise<UserDTO> {
    return this.service.updateUser(userId, updateUserPayload);
  }
}
