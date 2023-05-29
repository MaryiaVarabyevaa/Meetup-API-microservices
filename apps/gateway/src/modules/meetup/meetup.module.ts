import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import { AuthModule, RmqModule } from '@app/common';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { Services } from '../../common/constants';

@Module({
  imports: [
    RmqModule.register({
      name: Services.MEETUP,
    }),
    RmqModule.register({
      name: Services.INDEXER,
    }),
    AuthModule,
    GeocodingModule,
  ],
  controllers: [MeetupController],
  providers: [MeetupService],
})
export class MeetupModule {}
