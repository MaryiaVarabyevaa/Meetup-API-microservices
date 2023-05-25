import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CreateUserDto, LoginUserDto } from './dtos';
import { GetCurrentUser, GetCurrentUserId } from './decorators';
import { AtGuard, GoogleAuthGuard, RtGuard } from './guards';
import { clearCookies, setCookies } from './helpers';
import { GooglePayload } from './types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { refreshToken, accessToken } = await this.authService.signup(
      createUserDto,
    );
    setCookies(res, refreshToken, accessToken);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { refreshToken, accessToken } = await this.authService.login(
      loginUserDto,
    );
    setCookies(res, refreshToken, accessToken);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  loginWithGoogle(): void {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async redirect(
    @GetCurrentUser() user: GooglePayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { refreshToken, accessToken } =
      await this.authService.authorizeWithGoogle(user);
    setCookies(res, refreshToken, accessToken);
  }

  @UseGuards(AtGuard)
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(userId);
    clearCookies(res);
  }

  @Post('/refresh')
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') rt: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { refreshToken, accessToken } = await this.authService.refreshTokens(
      userId,
      rt,
    );
    setCookies(res, refreshToken, accessToken);
  }
}
