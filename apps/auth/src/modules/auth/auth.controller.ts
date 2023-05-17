import {Body, Controller, HttpCode, HttpStatus, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {CreateUserDto, LoginUserDto} from './dtos';
import {TokenPair} from '../token/types';
import {AtGuard, RtGuard} from "./guards";
import {GetCurrentUser, GetCurrentUserId} from "./decorators";


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createUserDto: CreateUserDto): Promise<TokenPair> {
   return this.authService.signup(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginUserDto: LoginUserDto): Promise<TokenPair> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<void> {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
      @GetCurrentUserId() userId: number,
      @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<TokenPair> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
