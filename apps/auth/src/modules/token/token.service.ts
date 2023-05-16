import {Inject, Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ExpireTime} from "./constants";
import {Payload, TokenData, TokenPair} from "./types";
import {AuthPrismaClient} from "@app/common";

@Injectable()
export class TokenService {

    constructor(
        private readonly jwtService: JwtService,
        @Inject('AUTH_PRISMA') private readonly authPrismaClient: AuthPrismaClient,
    ) {}

    private generateRefreshToken(payload: Payload): string {
        return this.jwtService.sign(payload, { expiresIn: ExpireTime.REFRESH_TOKEN });
    }

    private generateAccessToken(payload: Payload): string {
        return this.jwtService.sign(payload, { expiresIn: ExpireTime.ACCESS_TOKEN });
    }

    generateTokens(payload: Payload): TokenPair {
        return {
            refreshToken: this.generateRefreshToken(payload),
            accessToken: this.generateAccessToken(payload)
        }
    }

    validateRefreshToken(refreshToken: string): Payload {
        const decodedToken = this.jwtService.verify(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET
        })
        return decodedToken;
    }
    validateAccessToken(accessToken: string): Payload {
        const decodedToken = this.jwtService.verify(accessToken, {
            secret: process.env.JWT_ACCESS_SECRET
        })
        return decodedToken;
    }

    async saveRefreshToken(userId: number, refreshToken: string): Promise<void> {
        const token = await this.authPrismaClient.token.findUnique({ where: { userId } });

        if (token) {
            await this.authPrismaClient.token.update({
                where: { userId },
                data: { refreshToken }
            });
            return;
        }

        await this.authPrismaClient.token.create({
            data: {
                refreshToken,
                userId
            }
        });
    }

    async findRefreshToken(refreshToken: string): Promise<TokenData | null> {
        return this.authPrismaClient.token.findUnique({ where: { refreshToken } });
    }

    async removeRefreshToken(refreshToken: string): Promise<TokenData | null> {
        return this.authPrismaClient.token.delete({ where: { refreshToken } });
    }

}
