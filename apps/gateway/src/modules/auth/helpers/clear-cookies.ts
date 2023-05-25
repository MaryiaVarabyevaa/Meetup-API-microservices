import { Response } from 'express';

export const clearCookies = (res: Response) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
};
