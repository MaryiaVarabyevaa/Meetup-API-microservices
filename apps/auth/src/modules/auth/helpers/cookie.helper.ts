import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { TokenPair } from '../../token/types';
import { accessCookieExpiration, refreshCookieExpiration } from '../constants';

@Injectable()
export class CookieHelper {
  setCookies(res: Response, tokens: Promise<TokenPair>): void {
    tokens.then(({ refreshToken, accessToken }) => {
      this.setRtCookie(res, refreshToken);
      this.setAtCookie(res, accessToken);
    });
  }

  clearCookies(res: Response): void {
    this.clearRtCookie(res);
    this.clearAtCookie(res);
  }

  private setRtCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      expires: refreshCookieExpiration,
      httpOnly: true,
    });
  }

  private setAtCookie(res: Response, accessToken: string): void {
    res.cookie('accessToken', accessToken, {
      expires: accessCookieExpiration,
      httpOnly: true,
    });
  }

  private clearRtCookie(res: Response) {
    res.clearCookie('refreshToken');
  }

  private clearAtCookie(res: Response) {
    res.clearCookie('accessToken');
  }
}
