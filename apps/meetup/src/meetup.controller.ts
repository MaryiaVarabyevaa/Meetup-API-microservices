import { Controller, Get } from '@nestjs/common';
import { MeetupService } from './meetup.service';
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {RmqService} from "@app/common";

@Controller()
export class MeetupController {
  constructor(
      private readonly meetupService: MeetupService,
      private readonly rmqService: RmqService
  ) {}

  @Get()
  getHello(): string {
    return this.meetupService.getHello();
  }

  @EventPattern('meetup_created')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
   this.meetupService.createMeetup(data);
   this.rmqService.ack(context);
  }
}
