import { Module } from '@nestjs/common';
import { MeetupIndexerService } from './meetup-indexer.service';
import { MeetupIndexerController } from './meetup-indexer.controller';

@Module({
  providers: [MeetupIndexerService],
  controllers: [MeetupIndexerController]
})
export class MeetupIndexerModule {}
