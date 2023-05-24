import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MeetupId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<any>();
    const meetupData = message.data;
    return meetupData.id;
  },
);
