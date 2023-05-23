import { Controller } from '@nestjs/common';
import {RmqService} from "@app/common";
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {IndexerService} from "./indexer.service";
import {MeetupData, MeetupId} from "./decorators";

@Controller('meetup-indexer')
export class IndexerController {

    constructor(
        private readonly rmqService: RmqService,
        private readonly indexerService: IndexerService
    ) {}

    @MessagePattern({ cmd: 'createMeetup' })
    async handleAddMeetup(@MeetupData() data: any, @Ctx() context: RmqContext) {
       await this.indexerService.indexMeetup(data);
       this.rmqService.ack(context);
    }

    @MessagePattern({ cmd: 'updateMeetup' })
    async handleUpdateMeetup(@MeetupData() data: any, @Ctx() context: RmqContext) {
        await this.indexerService.updateMeetup(data);
        this.rmqService.ack(context);
    }

    @MessagePattern({ cmd: 'deleteMeetup' })
    async handleDeleteMeetup(@MeetupId() id: any, @Ctx() context: RmqContext) {
        await this.indexerService.deleteMeetup(id);
        this.rmqService.ack(context);
    }
}
