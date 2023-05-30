import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { GetData, GetId } from '../../common/decorators';
import { Pattern } from './constants';
import { RmqService } from '@app/common';
import { UploadAvatar } from './types';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: Pattern.UPLOAD_AVATAR })
  async handleUploadAvatar(
    @GetData() uploadAvatarData: UploadAvatar,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.rmqService.ack(context);
    await this.userService.uploadAvatar(uploadAvatarData);
  }

  @MessagePattern({ cmd: Pattern.CHANGE_ROLE })
  async handleUpdateRole(
    @GetId() userId: number,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.rmqService.ack(context);
    await this.userService.changeUserRole(userId);
  }
}
