import { LogoutUser } from './index';

export interface RefreshToken extends LogoutUser {
  refreshToken: string;
}
