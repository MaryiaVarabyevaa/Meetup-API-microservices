import {Module} from '@nestjs/common';
import {MeetupService} from './meetup.service';
import {MeetupController} from './meetup.controller';
import {MeetupPrismaModule, RmqModule} from '@app/common';
import {TagModule} from '../tag/tag.module';
import {TagOnMeetupModule} from '../tag-on-meetup/tag-on-meetup.module';
import {DirHelper, FileHelper} from './helpers';
import {INDEXER_MEETUP} from '../../../../gateway/src/constants/services';

@Module({
  imports: [
    MeetupPrismaModule,
    RmqModule.register({
      name: INDEXER_MEETUP,
    }),
    TagModule,
    TagOnMeetupModule
  ],
  providers: [MeetupService, DirHelper, FileHelper],
  controllers: [MeetupController],
  exports: [MeetupService]
})
export class MeetupModule {}
