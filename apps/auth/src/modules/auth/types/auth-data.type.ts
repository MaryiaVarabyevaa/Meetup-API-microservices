import { CreateUser, LoginUser, LogoutUser, RefreshToken } from './index';

export type AuthData = {
  data: CreateUser | LoginUser | LogoutUser | RefreshToken;
};
