import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { AtStrategy, RtStrategy } from './strategies';
import { TokenModule } from '../token/token.module';
import { JwtModule } from '@nestjs/jwt';
import { CookieHelper, JwtHelper } from './helpers';
import {RmqModule} from "@app/common";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    JwtModule.register({}),
    UserModule,
    TokenModule,
    RmqModule
  ],
  providers: [AuthService, JwtHelper, CookieHelper, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
