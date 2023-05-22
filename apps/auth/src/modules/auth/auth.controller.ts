import {
  Body,
  Controller, Get,
  HttpCode,
  HttpStatus,
  Post, Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { TokenPair } from '../token/types';
import {AtGuard, GoogleAuthGuard, RtGuard} from './guards';
import { GetCurrentUser, GetCurrentUserId } from './decorators';
import { Response } from 'express';
import { CookieHelper } from './helpers';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { TokenService } from '../token/token.service';
import {GooglePayload} from "./types";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieHelper: CookieHelper,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenPair> {
    const userData = this.authService.signup(createUserDto);
    this.cookieHelper.setCookies(res, userData);
    return userData;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenPair> {
    const userData = this.authService.login(loginUserDto);
    this.cookieHelper.setCookies(res, userData);
    return userData;
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  loginWithGoogle() {
    return { msg: 'Google Authentication' };
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  redirect(
      @GetCurrentUser() user: GooglePayload,
      @Res({ passthrough: true }) res: Response,
  ) {
    const userData = this.authService.authorizeWithGoogle(user);
    this.cookieHelper.setCookies(res, userData);
    return userData;
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    this.cookieHelper.clearCookies(res);
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokenPair> {
    const userData = this.authService.refreshTokens(userId, refreshToken);
    this.cookieHelper.setCookies(res, userData);
    return userData;
  }

  // @MessagePattern({ cmd: 'validateUser' })
  // handleFindByIdMeetups(
  //     // @MeetupData() meetupData: IdObject,
  //     @Ctx() context: RmqContext,
  // ) {
  //   console.log('here');
  // }

  @MessagePattern('validate_user')
  async validateUser(@Payload() data: any, @Ctx() context: RmqContext) {
    const res = this.tokenService.validateAccessToken(data.accessToken);
    return res;
  }
}
