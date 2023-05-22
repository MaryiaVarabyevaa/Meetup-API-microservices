import { Module } from '@nestjs/common';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';
import {FileUploadMiddleware} from "./middlewares";
import {MulterModule} from "@nestjs/platform-express";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    MulterModule.registerAsync({
      useClass: FileUploadMiddleware,
    }),
    AuthModule,
    TokenModule,
    UserModule,
    RmqModule,
  ],
  // controllers: [AuthController, UserController],
  // providers: [UserService, AuthService, TokenService],
})
export class AppModule {}
