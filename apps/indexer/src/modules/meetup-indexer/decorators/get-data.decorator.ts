import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Message } from '../types';

export const GetData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<Message>();
    const meetupData = message.data;
    return meetupData;
  },
);
