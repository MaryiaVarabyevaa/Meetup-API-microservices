import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Services } from '../../common/constants';
import { ClientProxy } from '@nestjs/microservices';
import { ErrorMessage, Pattern } from './constants';
import { Data, Tokens } from './types';
import { CreateUserDto, LoginUserDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(@Inject(Services.AUTH) private authClient: ClientProxy) {}

  async signup(createUserDto: CreateUserDto): Promise<Tokens> {
    const res = await this.sendMessageToAuthClient(
      Pattern.SIGNUP,
      createUserDto,
    );
    if (!res) {
      throw new ConflictException(ErrorMessage.CONFLICT);
    }
    return res;
  }

  async login(loginUserDto: LoginUserDto): Promise<Tokens> {
    const res = await this.sendMessageToAuthClient(Pattern.LOGIN, loginUserDto);
    if (!res) {
      throw new UnauthorizedException(ErrorMessage.UNAUTHORIZED);
    }
    return res;
  }

  async authorizeWithGoogle(createUserDto: CreateUserDto): Promise<Tokens> {
    return this.sendMessageToAuthClient(
      Pattern.AUTH_WITH_GOOGLE,
      createUserDto,
    );
  }

  async logout(id: number): Promise<void> {
    await this.sendMessageToAuthClient(Pattern.LOGOUT, { id });
  }

  async refreshTokens(
    id: number,
    refreshToken: string,
  ): Promise<Tokens | null> {
    const res = await this.sendMessageToAuthClient(Pattern.REFRESH, {
      id,
      refreshToken,
    });
    if (!res) {
      throw new NotFoundException(ErrorMessage.NOT_FOUND);
    }
    return res;
  }

  private async sendMessageToAuthClient(msg: string, data: Data) {
    const pattern = { cmd: msg };
    return await this.authClient.send(pattern, { data }).toPromise();
  }
}
