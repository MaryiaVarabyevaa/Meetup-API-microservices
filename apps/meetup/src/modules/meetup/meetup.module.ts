import { Module } from '@nestjs/common';
import { MeetupService } from './meetup.service';
import { MeetupController } from './meetup.controller';
import { MeetupPrismaModule, RmqModule } from '@app/common';
import { TagModule } from '../tag/tag.module';
import { INDEXER_SERVICE } from './constants';

@Module({
  imports: [
    MeetupPrismaModule,
    RmqModule.register({
      name: INDEXER_SERVICE,
    }),
    TagModule,
  ],
  providers: [MeetupService],
  controllers: [MeetupController],
  exports: [MeetupService],
})
export class MeetupModule {}
