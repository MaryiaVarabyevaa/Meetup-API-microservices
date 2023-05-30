import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Pattern } from './constants';
import { GetData, GetId } from '../../common/decorators';
import { CreateUser, LoginUser, RefreshToken } from './types';
import { RmqService } from '@app/common';
import { TokenService } from '../token/token.service';
import { TokenPair } from '../token/types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly rmqService: RmqService,
    private readonly tokenService: TokenService,
  ) {}

  @MessagePattern({ cmd: Pattern.SIGNUP })
  async handleSignup(
    @GetData() createUserData: CreateUser,
    @Ctx() context: RmqContext,
  ): Promise<TokenPair | null> {
    this.rmqService.ack(context);
    return await this.authService.signup(createUserData);
  }

  @MessagePattern({ cmd: Pattern.LOGIN })
  async handleLogin(
    @GetData() loginUserData: LoginUser,
    @Ctx() context: RmqContext,
  ): Promise<TokenPair | null> {
    this.rmqService.ack(context);
    return await this.authService.login(loginUserData);
  }

  @MessagePattern({ cmd: Pattern.AUTH_WITH_GOOGLE })
  async handleAuthorizeWithGoogle(
    @GetData() createUserData: CreateUser,
    @Ctx() context: RmqContext,
  ) {
    this.rmqService.ack(context);
    return await this.authService.authorizeWithGoogle(createUserData);
  }

  @MessagePattern({ cmd: Pattern.LOGOUT })
  async handleLogout(
    @GetId() userId: number,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.rmqService.ack(context);
    await this.authService.logout(userId);
  }

  @MessagePattern({ cmd: Pattern.REFRESH })
  async handleRefreshToken(
    @GetData() refreshTokenData: RefreshToken,
    @Ctx() context: RmqContext,
  ): Promise<TokenPair> {
    this.rmqService.ack(context);
    return await this.authService.refreshTokens(
      refreshTokenData.id,
      refreshTokenData.refreshToken,
    );
  }

  @MessagePattern(Pattern.VALIDATE_USER)
  validateUser(@Payload() data: any, @Ctx() context: RmqContext) {
    const res = this.tokenService.validateAccessToken(data.accessToken);
    return res;
  }
}
