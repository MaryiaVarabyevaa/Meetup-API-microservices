import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUser, LoginUser } from './types';
import { TokenPair } from '../token/types';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { Provider, User } from '@prisma/client/auth';
import { JwtHelper } from './helpers';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async signup(createUserDto: CreateUser): Promise<TokenPair | null> {
    const user = await this.userService.findUserByEmail(createUserDto.email);

    if (user) {
      return null;
    }

    const { password, ...rest } = createUserDto;
    const hashPassword = await this.hashData(password);
    const newUserInfo = {
      ...rest,
      password: hashPassword,
    };

    const newUser = await this.userService.addUser(newUserInfo);

    return this.generateTokens(newUser);
  }

  async login(loginUserDto: LoginUser): Promise<TokenPair | null> {
    const user = await this.userService.findUserByEmail(loginUserDto.email);

    if (!user) {
      return null;
    }

    const isPasswordEqual = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordEqual) {
      return null;
    }

    return await this.generateTokens(user);
  }

  async authorizeWithGoogle(user: CreateUser) {
    const { email } = user;

    const ExistedUser = await this.userService.findUserByEmail(email);
    let newUser: User | null;

    if (!ExistedUser) {
      newUser = await this.userService.addUser({
        ...user,
        provider: Provider.GMAIL,
      });
    }

    return await this.generateTokens(newUser || ExistedUser);
  }

  async logout(userId: number): Promise<void> {
    await this.tokenService.removeRefreshToken(userId);
  }

  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<TokenPair> {
    const user = await this.userService.findUserById(userId);
    if (!user) {
      return null;
    }

    const isTokenEqual = await this.tokenService.compareRefreshToken(
      user.id,
      refreshToken,
    );

    if (!isTokenEqual) {
      return null;
    }

    return this.generateTokens(user);
  }

  private async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  private async generateTokens(user: User) {
    const payload = JwtHelper.generateJwtPayload(user);
    const tokens = await this.tokenService.generateTokens(payload);
    const hashToken = await this.hashData(tokens.refreshToken);
    await this.tokenService.saveRefreshToken(user.id, hashToken);
    return tokens;
  }
}
