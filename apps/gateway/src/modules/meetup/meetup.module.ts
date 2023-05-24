import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import { AuthModule, RmqModule } from '@app/common';
import { MEETUP_SERVICE } from '../../constants';
import { INDEXER_MEETUP } from '../../constants/services';
import {GeocodingModule} from "../geocoding/geocoding.module";

@Module({
  imports: [
    RmqModule.register({
      name: MEETUP_SERVICE,
    }),
    RmqModule.register({
      name: INDEXER_MEETUP,
    }),
    AuthModule,
    GeocodingModule
  ],
  controllers: [MeetupController],
  providers: [MeetupService],
})
export class MeetupModule {}
