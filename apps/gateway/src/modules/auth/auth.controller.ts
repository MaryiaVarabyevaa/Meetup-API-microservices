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
import { Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from './dtos';
import { GetCurrentUser, GetCurrentUserId } from './decorators';
import { AtGuard, GoogleAuthGuard, RtGuard } from './guards';
import { clearCookies, setCookies } from './helpers';
import { GooglePayload } from './types';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerDescription } from './constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SwaggerDescription.SIGNUP,
  })
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
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SwaggerDescription.LOGIN,
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: SwaggerDescription.LOGOUT,
  })
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @GetCurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(userId);
    clearCookies(res);
  }

  @UseGuards(RtGuard)
  @Post('/refresh')
  @ApiResponse({
    status: HttpStatus.OK,
    description: SwaggerDescription.REFRESH,
  })
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
