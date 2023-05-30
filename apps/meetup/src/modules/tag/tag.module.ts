import { Module } from '@nestjs/common';
import { MeetupPrismaModule } from '@app/common';
import { TagService } from './tag.service';
import { TagOnMeetupService } from './services';

@Module({
  imports: [MeetupPrismaModule],
  providers: [TagService, TagOnMeetupService],
  exports: [TagService, TagOnMeetupService],
})
export class TagModule {}
