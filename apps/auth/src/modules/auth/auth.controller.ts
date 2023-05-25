import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Pattern } from './constants';
import { ExtractData, ExtractId } from '../../shared/decorators';
import { CreateUser, LoginUser, RefreshToken } from './types';
import { RmqService } from '@app/common';
import { TokenService } from '../token/token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
    private readonly tokenService: TokenService,
  ) {}

  @MessagePattern({ cmd: Pattern.SIGNUP })
  handleSignup(
    @ExtractData() createUserData: CreateUser,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.authService.signup(createUserData);
  }

  @MessagePattern({ cmd: Pattern.LOGIN })
  handleLogin(
    @ExtractData() loginUserData: LoginUser,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.authService.login(loginUserData);
  }

  @MessagePattern({ cmd: Pattern.AUTH_WITH_GOOGLE })
  async handleAuthorizeWithGoogle(
    @ExtractData() createUserData: CreateUser,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return await this.authService.authorizeWithGoogle(createUserData);
  }

  @MessagePattern({ cmd: Pattern.LOGOUT })
  async handleLogout(@ExtractId() userId: number, @Ctx() context: RmqContext) {
    this.rmqService.ack(context);
    await this.authService.logout(userId);
  }

  @MessagePattern({ cmd: Pattern.REFRESH })
  handleRefreshToken(
    @ExtractData() refreshTokenData: RefreshToken,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return this.authService.refreshTokens(
      refreshTokenData.userId,
      refreshTokenData.refreshToken,
    );
  }

  @MessagePattern(Pattern.VALIDATE_USER)
  async validateUser(@Payload() data: any, @Ctx() context: RmqContext) {
    const res = this.tokenService.validateAccessToken(data.accessToken);
    return res;
  }
}
