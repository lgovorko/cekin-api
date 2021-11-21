import {
  Controller,
  Post,
  Req,
  Body,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RoleGuard } from './roles.guard';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { AccessToken } from '../shared/decorators';
import { AuthLoginResponseDTO, AuthLoginDTO, ResendVerificationMailRequestDTO } from './dto';
import { UserRegisterDTO, UserDTO, UserRegisterResponseDTO } from '../users/dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOkResponse({ type: AuthLoginResponseDTO })
  @UseInterceptors(new TransformInterceptor(AuthLoginResponseDTO))
  @Get('verify/access-token')
  verifyAccessToken(
    @Query() queryStringPayload: { kind: string },
    @AccessToken() accessToken: string,
  ): Promise<AuthLoginResponseDTO> {
    return this.service.verifyAccessToken(accessToken, queryStringPayload);
  }

  @ApiOkResponse({ type: AuthLoginResponseDTO })
  @UseInterceptors(new TransformInterceptor(AuthLoginResponseDTO))
  @Post('login')
  async standardLogin(
    @Body() userLoginPayload: AuthLoginDTO,
  ): Promise<AuthLoginResponseDTO> {
    return this.service.userLogin(userLoginPayload);
  }

  @ApiOkResponse({ type: UserDTO })
  @UseInterceptors(new TransformInterceptor(UserDTO))
  @Post('register')
  registerUser(@Body() userRegisterPayload: UserRegisterDTO): Promise<UserRegisterResponseDTO> {
    return this.service.registerUser(userRegisterPayload);
  }

  @ApiOkResponse({ type: AuthLoginResponseDTO })
  @UseInterceptors(new TransformInterceptor(AuthLoginResponseDTO))
  @Post('admin/login')
  async adminLogin(
    @Body() adminLoginPayload: AuthLoginDTO,
  ): Promise<AuthLoginResponseDTO> {
    return this.service.adminLogin(adminLoginPayload);
  }

  // @ApiOkResponse({ type: AuthLoginResponseDTO })
  // @UseInterceptors(new TransformInterceptor(AuthLoginResponseDTO))
  // @Post('facebook/login')
  // facebookLogin() {
  //   return this.service.facebookLogin();
  // }

  // @ApiOkResponse({ type: AuthLoginResponseDTO })
  // @UseInterceptors(new TransformInterceptor(AuthLoginResponseDTO))
  // @Post('google/login')
  // googleLogin() {
  //   return this.service.googleLogin();
  // }
}
