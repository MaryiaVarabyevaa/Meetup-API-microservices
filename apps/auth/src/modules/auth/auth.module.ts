import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {AuthController} from './auth.controller';
import {UserModule} from '../user/user.module';
import {AtStrategy, RtStrategy} from './strategies';
import {TokenModule} from "../token/token.module";
import {JwtModule} from "@nestjs/jwt";
import {JwtHelper} from "./helpers/jwt.helper";

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    TokenModule
  ],
  providers: [
    AuthService,
    JwtHelper,
    AtStrategy,
    RtStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule {}
