import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import {RmqModule} from "@app/common";
import {MEETUP_SERVICE} from "../../constants";

@Module({
  imports: [
    RmqModule.register({
      name: MEETUP_SERVICE
    }),
  ],
  controllers: [MeetupController],
  providers: [MeetupService]
})
export class MeetupModule {}
