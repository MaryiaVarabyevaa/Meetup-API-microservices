import { Response } from 'express';
import { atCookieExpiration, rtCookieExpiration } from '../constants';

export const setCookies = (
  res: Response,
  refreshToken: string,
  accessToken: string,
) => {
  res.cookie('refreshToken', refreshToken, {
    expires: rtCookieExpiration,
    httpOnly: true,
  });

  res.cookie('accessToken', accessToken, {
    expires: atCookieExpiration,
    httpOnly: true,
  });
};
