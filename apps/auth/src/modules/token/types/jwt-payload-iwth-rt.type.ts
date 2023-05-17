import {Payload} from "./payload.type";
import {RefreshToken} from "./refresh-token.type";

export type JwtPayloadWithRt = Payload & RefreshToken;