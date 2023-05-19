import { Controller } from '@nestjs/common';
import {MeetupService} from "./meetup.service";
import {Ctx, EventPattern, Payload, RmqContext} from "@nestjs/microservices";
import {CreateMeetup, StandartMessage} from "./types";

@Controller('meetup')
export class MeetupController {

    constructor(
       private readonly meetupService: MeetupService
    ) {}

    @EventPattern('find_all_meetups')
    handleFindAllMeetups(@Payload() data: StandartMessage, @Ctx() context: RmqContext) {
        console.log('hereee')
        this.meetupService.findAllMeetups();
    }

    @EventPattern('add_meetups')
    handleAddMeetup(@Payload() data: CreateMeetup, @Ctx() context: RmqContext) {
        this.meetupService.addMeetup(data);
    }

    @EventPattern('meetup_created')
    async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    }
}
