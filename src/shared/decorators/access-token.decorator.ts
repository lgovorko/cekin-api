import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AccessToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();

    const {
      headers: { authorization },
    } = request;

    const [, accessToken] = authorization.split('Bearer ');

    return accessToken;
  },
);
