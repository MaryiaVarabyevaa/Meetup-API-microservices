import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthPrismaClient, AuthPrismaModule } from '@app/common';
import { PassportModule } from '@nestjs/passport';
import {JwtModule, JwtService} from '@nestjs/jwt';

@Module({
  imports: [AuthPrismaModule],
  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
