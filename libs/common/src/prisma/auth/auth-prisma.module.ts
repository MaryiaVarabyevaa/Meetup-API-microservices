import * as path from 'path';
import { Module } from '@nestjs/common';
import { AuthPrismaClient } from '../prisma-client';
import { AuthPrismaService } from './auth-prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    AuthPrismaClient,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'libs',
        'common',
        'src',
        'prisma',
        '.env',
      ),
    }),
  ],
  providers: [
    {
      provide: 'AUTH_PRISMA',
      useValue: new AuthPrismaClient(),
    },
    AuthPrismaClient,
    AuthPrismaService,
  ],
  exports: ['AUTH_PRISMA', AuthPrismaService],
})
export class AuthPrismaModule {}
