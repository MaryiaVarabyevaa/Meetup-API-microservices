import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Message } from '../types';

export const ExtractData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<Message>();
    const meetupData = message.data;

    if ('id' in meetupData) {
      return { ...meetupData, id: Number(meetupData.id) };
    }

    return meetupData;
  },
);
