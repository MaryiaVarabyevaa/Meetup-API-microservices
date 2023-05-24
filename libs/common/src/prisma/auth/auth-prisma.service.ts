import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AuthPrismaClient } from '../prisma-client';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';

@Injectable()
export class AuthPrismaService
  extends AuthPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(@Inject(ConfigService) configService: ConfigService) {
    const url = configService.get<string>('AUTH_DATABASE_URL');
    super({
      datasources: {
        db: {
          url,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
