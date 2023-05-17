import { Module } from '@nestjs/common';
import { TokenModule } from './modules/token/token.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
    }),
    AuthModule,
    TokenModule,
    UserModule,
  ],
  // controllers: [AuthController, UserController],
  // providers: [UserService, AuthService, TokenService],
})
export class AppModule {}
