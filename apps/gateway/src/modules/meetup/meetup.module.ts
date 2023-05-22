import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import { RmqModule, AuthModule } from '@app/common';
import { MEETUP_SERVICE } from '../../constants';

@Module({
  imports: [
    RmqModule.register({
      name: MEETUP_SERVICE,
    }),
    AuthModule
  ],
  controllers: [MeetupController],
  providers: [MeetupService],
})
export class MeetupModule {}
