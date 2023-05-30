import { Controller } from '@nestjs/common';
import { MeetupService } from './meetup.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { CreateMeetup, IdObject, UpdateMeetup } from './types';
import { RmqService } from '@app/common';
import { Meetup } from '@prisma/client/meetup';
import { GetData } from './decorators';
import { Pattern } from './constants';

@Controller('meetup')
export class MeetupController {
  constructor(
    private readonly meetupService: MeetupService,
    private readonly rmqService: RmqService,
  ) {}

  @MessagePattern({ cmd: Pattern.CREATE_MEETUP })
  handleAddMeetups(
    @GetData() meetupData: CreateMeetup,
    @Ctx() context: RmqContext,
  ): Promise<Meetup> {
    const meetup = this.meetupService.addMeetup(meetupData);
    this.rmqService.ack(context);
    return meetup;
  }

  @MessagePattern({ cmd: Pattern.UPDATE_MEETUP })
  handleUpdateMeetups(
    @GetData() meetupData: UpdateMeetup,
    @Ctx() context: RmqContext,
  ): Promise<Meetup> {
    const meetup = this.meetupService.updateMeetup(meetupData);
    this.rmqService.ack(context);
    return meetup;
  }

  @MessagePattern({ cmd: Pattern.DELETE_MEETUP })
  handleDeleteMeetups(
    @GetData() meetupData: IdObject,
    @Ctx() context: RmqContext,
  ): Promise<Meetup> {
    const meetup = this.meetupService.deleteMeetup(meetupData);
    this.rmqService.ack(context);
    return meetup;
  }
}
