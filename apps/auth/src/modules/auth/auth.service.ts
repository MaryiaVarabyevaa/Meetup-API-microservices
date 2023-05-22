import * as bcrypt from 'bcrypt';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {Provider, User} from '@prisma/client/auth';
import { TokenPair } from '../token/types';
import { TokenService } from '../token/token.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { JwtHelper } from './helpers/jwt.helper';
import { ErrorMessages } from './constants';
import {GooglePayload} from "./types";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<TokenPair> {
    const { password, ...rest } = createUserDto;
    const hashPassword = await this.hashData(password);
    const newUserInfo = {
      ...rest,
      password: hashPassword,
    };

    const newUser = await this.userService.addUser(newUserInfo);

    return this.generateTokens(newUser);
  }

  async login(loginUserDto: LoginUserDto): Promise<TokenPair> {
    const user = await this.userService.findUserByEmail(loginUserDto.email);

    if (!user) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED_ERROR);
    }

    const isPasswordEqual = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordEqual) {
      throw new UnauthorizedException(ErrorMessages.UNAUTHORIZED_ERROR);
    }

    return await this.generateTokens(user);
  }

  async authorizeWithGoogle(user: GooglePayload) {
    const { email } = user;

    const isExistedUser = await this.userService.findUserByEmail(email);

    if (!isExistedUser) {
      const newUser = await this.userService.addUser({
        ...user,
        provider: Provider.GMAIL
      });
      return this.generateTokens(newUser);
    }

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
      throw new NotFoundException(ErrorMessages.NOTFOUND_ERROR);
    }

    const isTokenEqual = await this.tokenService.compareRefreshToken(
      user.id,
      refreshToken,
    );

    if (!isTokenEqual) {
      throw new ForbiddenException(ErrorMessages.FORBIDDEN_ERROR);
    }

    return this.generateTokens(user);
  }

  private async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  private async generateTokens(user: User) {
    const payload = this.jwtHelper.generateJwtPayload(user);
    const tokens = await this.tokenService.generateTokens(payload);
    const hashToken = await this.hashData(tokens.refreshToken);
    await this.tokenService.saveRefreshToken(user.id, hashToken);
    return tokens;
  }
}
