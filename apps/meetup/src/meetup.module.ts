import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import {RmqModule} from "@app/common";
import {ConfigModule} from "@nestjs/config";

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: './apps/meetup/.env'
      }),
      RmqModule
  ],
  controllers: [MeetupController],
  providers: [MeetupService],
})
export class MeetupModule {}
