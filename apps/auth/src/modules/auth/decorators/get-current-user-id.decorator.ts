import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {Payload} from "../../token/types";

export const GetCurrentUserId = createParamDecorator(
    (_: undefined, context: ExecutionContext): number => {
        const request = context.switchToHttp().getRequest();
        const user = request.user as Payload;
        return user.sub;
    },
);