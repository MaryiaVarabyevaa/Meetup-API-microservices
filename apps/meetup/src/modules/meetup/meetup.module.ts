import {Module} from '@nestjs/common';
import {MeetupService} from './meetup.service';
import {MeetupController} from './meetup.controller';
import {MeetupPrismaModule, RmqModule} from "@app/common";
import {TagModule} from "../tag/tag.module";
import {TagOnMeetupModule} from "../tag-on-meetup/tag-on-meetup.module";

@Module({
  imports: [
    MeetupPrismaModule,
    RmqModule,
    TagModule,
    TagOnMeetupModule,
  ],
  providers: [MeetupService],
  controllers: [MeetupController]
})
export class MeetupModule {}
