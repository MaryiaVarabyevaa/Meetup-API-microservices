import {RefreshToken} from "./refresh-token.type";
import {AccessToken} from "./access-token.type";

export type TokenPair = RefreshToken & AccessToken;