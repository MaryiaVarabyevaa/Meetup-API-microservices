import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthPrismaModule } from '@app/common';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [AuthPrismaModule, JwtModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
