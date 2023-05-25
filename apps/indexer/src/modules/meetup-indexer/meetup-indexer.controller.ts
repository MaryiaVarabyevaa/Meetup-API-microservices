import { Controller } from '@nestjs/common';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import { MeetupData, MeetupId } from './decorators';
import { RmqService } from '@app/common';
import { MeetupIndexerService } from './meetup-indexer.service';
import {
  CreateMeetupData,
  FindAllMeetupsData,
  IdData,
  Meetup,
  UpdateMeetupData,
} from './types';
import { Pattern } from './constants';

@Controller()
export class MeetupIndexerController {
  constructor(
    private readonly rmqService: RmqService,
    private readonly meetupIndexerService: MeetupIndexerService,
  ) {}

  @MessagePattern({ cmd: Pattern.FIND_ALL_MEETUPS })
  async handleFindAllMeetups(
    @MeetupData() data: FindAllMeetupsData,
    @Ctx() context: RmqContext,
  ): Promise<Meetup[]> {
    const meetups = await this.meetupIndexerService.searchMeetups(data);
    this.rmqService.ack(context);
    return meetups;
  }

  @MessagePattern({ cmd: Pattern.FIND_BY_ID_MEETUP })
  handleFindByIdMeetups(
    @MeetupId() id: IdData,
    @Ctx() context: RmqContext,
  ): Promise<Meetup> {
    const meetup = this.meetupIndexerService.findMeetupById(id);
    this.rmqService.ack(context);
    return meetup;
  }

  @MessagePattern({ cmd: Pattern.CREATE_MEETUP })
  async handleAddMeetup(
    @MeetupData() data: CreateMeetupData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.meetupIndexerService.indexMeetup(data);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.UPDATE_MEETUP })
  async handleUpdateMeetup(
    @MeetupData() data: UpdateMeetupData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.meetupIndexerService.updateMeetup(data);
    this.rmqService.ack(context);
  }

  @MessagePattern({ cmd: Pattern.DELETE_MEETUP })
  async handleDeleteMeetup(
    @MeetupId() id: IdData,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.meetupIndexerService.deleteMeetup(id);
    this.rmqService.ack(context);
  }
}
