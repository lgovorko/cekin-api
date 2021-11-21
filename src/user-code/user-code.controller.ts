import { Body, Controller, Get, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { CodeCheckDTO, UserCodeDTO } from './dto';
import { UserCodeService } from './user-code.service';

@ApiTags('user-code')
@Controller('user-code')
export class UserCodeController {
  constructor(private readonly service: UserCodeService) {}

  @Roles('SUPERADMIN', 'ADMIN')
  @ApiOkResponse({ type: UserCodeDTO })
  @UseInterceptors(new TransformInterceptor(UserCodeDTO))
  @Post('/check/user-entry')
  checkCode(@Body() codeCheckPayload: CodeCheckDTO): Promise<UserCodeDTO[]> {
    return this.service.checkCode(codeCheckPayload);
  }
}
