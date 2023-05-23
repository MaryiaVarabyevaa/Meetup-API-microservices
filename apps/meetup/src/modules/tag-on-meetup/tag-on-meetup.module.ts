import { Module } from '@nestjs/common';
import { MeetupPrismaModule } from '@app/common';
import { TagOnMeetupService } from './tag-on-meetup.service';

@Module({
  imports: [MeetupPrismaModule],
  providers: [TagOnMeetupService],
  exports: [TagOnMeetupService],
})
export class TagOnMeetupModule {}
