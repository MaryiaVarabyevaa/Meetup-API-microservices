import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeetupPrismaClient } from '../prisma-client';
import { MeetupPrismaService } from './meetup-prisma.service';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "libs/common/.env",
    })
  ],
  providers: [
    {
      provide: 'MEETUP_PRISMA',
      useValue: new MeetupPrismaClient(),
    },
    MeetupPrismaService,
  ],
  exports: ['MEETUP_PRISMA', MeetupPrismaService],
})
export class MeetupPrismaModule {}
