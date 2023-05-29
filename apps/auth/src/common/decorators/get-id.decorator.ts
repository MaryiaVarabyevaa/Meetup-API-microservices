import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthData, LogoutUser } from '../../modules/auth/types';
import { UserData } from '../../modules/user/types';

export const GetId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const message = ctx.switchToRpc().getData<AuthData & UserData>();
    const meetupData = message.data as LogoutUser;
    return Number(meetupData.id);
  },
);
