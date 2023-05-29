import {Inject, Injectable} from '@nestjs/common';
import {Services} from '../../common/constants';
import {ClientProxy} from '@nestjs/microservices';
import {Pattern} from './constants';

@Injectable()
export class UserService {
  constructor(
      @Inject(Services.AUTH) private authClient: ClientProxy,
  ) {}

  async changeUserRole(id: number): Promise<void> {
    await this.sendMessageToAuthClient(Pattern.CHANGE_ROLE, { id });
  }

  async uploadAvatar(id: number, link: string): Promise<string> {
    return await this.sendMessageToAuthClient(Pattern.UPLOAD_AVATAR, { id, link });
  }

  private async sendMessageToAuthClient(msg: string, data: any) {
    const pattern = { cmd: msg };
    return await this.authClient.send(pattern, { data }).toPromise();
  }
}
