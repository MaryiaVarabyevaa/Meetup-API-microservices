import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RmqModule, YandexCloudModule } from '@app/common';
import { Services } from '../../common/constants';

@Module({
  imports: [
    RmqModule.register({
      name: Services.AUTH,
    }),
    YandexCloudModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
