import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { errorMessage } from '../error-messages/error-messages';

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const {
      user: { userId },
    } = request;

    if (!userId) throw new BadRequestException(errorMessage.userRequestNotFound)

    return userId;
  },
);
