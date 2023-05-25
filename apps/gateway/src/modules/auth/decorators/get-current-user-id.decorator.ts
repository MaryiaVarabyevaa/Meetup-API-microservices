import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as TokenPayload;
    return user.sub;
  },
);
