import {Controller} from '@nestjs/common';
import {MeetupService} from './meetup.service';
import {Ctx, MessagePattern, RmqContext} from '@nestjs/microservices';
import {CreateMeetup, IdObject, UpdateMeetup} from './types';
import {RmqService} from '@app/common';
import {Meetup} from '@prisma/client/meetup';
import {MeetupData} from './decorators';
import {FileHelper} from './helpers';


@Controller('meetup')
export class MeetupController {
  constructor(
    private readonly meetupService: MeetupService,
    private readonly rmqService: RmqService,
    private readonly fileHelper: FileHelper,
  ) {}

  @MessagePattern({ cmd: 'createMeetup' })
  handleAddMeetups(
    @MeetupData() meetupData: CreateMeetup,
    @Ctx() context: RmqContext,
  ) {
    const meetup = this.meetupService.addMeetup(meetupData);
    this.rmqService.ack(context);
    return meetup;
  }

  @MessagePattern({ cmd: 'updateMeetup' })
  handleUpdateMeetups(
    @MeetupData() meetupData: UpdateMeetup,
    @Ctx() context: RmqContext,
  ) {
    const meetup = this.meetupService.updateMeetup(meetupData);
    this.rmqService.ack(context);
    return meetup;
  }

  @MessagePattern({ cmd: 'deleteMeetup' })
  handleDeleteMeetups(
    @MeetupData() meetupData: IdObject,
    @Ctx() context: RmqContext,
  ): Promise<Meetup> {
    const meetup = this.meetupService.deleteMeetup(meetupData);
    this.rmqService.ack(context);
    return meetup;
  }

}
