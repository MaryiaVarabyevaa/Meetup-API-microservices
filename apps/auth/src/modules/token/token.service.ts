import * as bcrypt from "bcrypt";
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExpireTime } from './constants';
import {JwtPayload, Payload, TokenData, TokenPair} from './types';
import { AuthPrismaClient } from '@app/common';
import {ConfigService} from "@nestjs/config";
import {config} from "rxjs";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('AUTH_PRISMA') private readonly authPrismaClient: AuthPrismaClient,
    private configService: ConfigService,
  ) {}


  private async generateRefreshToken(payload: Payload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: ExpireTime.REFRESH_TOKEN,
    });
  }

  private async generateAccessToken(payload: Payload): Promise<string> {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: ExpireTime.ACCESS_TOKEN,
    });
  }

  async generateTokens(payload: Payload): Promise<TokenPair> {
    const [refreshToken, accessToken] = await Promise.all([this.generateRefreshToken(payload), this.generateAccessToken(payload)]);
    return { refreshToken, accessToken };
  }

  validateRefreshToken(refreshToken: string): JwtPayload {
    const decodedToken = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    return decodedToken;
  }
  // validateAccessToken(accessToken: string): JwtPayload {
  //   const decodedToken = this.jwtService.verify(accessToken, {
  //     secret: process.env.JWT_ACCESS_SECRET,
  //   });
  //   return decodedToken;
  // }
  //

  async compareRefreshToken(userId: number, refreshToken: string): Promise<boolean> {
    const token = await this.authPrismaClient.token.findUnique({ where: { userId } });
    const isTokenEqual = await bcrypt.compare(refreshToken, token.refreshToken);
    return isTokenEqual? true : false;
  }

  async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const token = await this.authPrismaClient.token.findUnique({ where: {userId} });

    if (token) {
      await this.authPrismaClient.token.update({
        where: {userId},
        data: {refreshToken},
      });
      return;
    }

    await this.authPrismaClient.token.create({
      data: {
        refreshToken,
        userId,
      },
    });
  }

  // async findRefreshToken(refreshToken: string): Promise<TokenData | null> {
  //   return this.authPrismaClient.token.findUnique({ where: { refreshToken } });
  // }
  //
  async removeRefreshToken(userId: number): Promise<TokenData | null> {
    return this.authPrismaClient.token.delete({ where: { userId } });
  }
}
