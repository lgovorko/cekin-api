import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { RoleE } from '../shared/enum';
import { errorMessage } from '../shared/error-messages/error-messages';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user: any = request.user;

    const userRole = RoleE[`${user.role}`];

    const hasRole = () => roles.find(r => r === userRole);

    if (user && user.role && hasRole()) return true;

    throw new ForbiddenException(`${errorMessage.youDontHavePermision}`);
  }
}
