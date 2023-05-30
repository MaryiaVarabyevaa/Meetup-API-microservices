import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthPrismaModule, RmqModule } from '@app/common';

@Module({
  imports: [AuthPrismaModule, RmqModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
