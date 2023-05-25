import { TokenPayload, RefreshToken } from './index';

export type JwtPayloadWithRt = TokenPayload & { refreshToken: RefreshToken };
