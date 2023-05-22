import { Controller } from '@nestjs/common';
import { MeetupService } from './meetup.service';
import { Ctx, MessagePattern, RmqContext } from '@nestjs/microservices';
import {CreateMeetup, IdObject, TypeObject, UpdateMeetup} from './types';
import { RmqService } from '@app/common';
import { Meetup } from '@prisma/client/meetup';
import { MeetupData } from './decorators';
import path from "path";
import * as fs from "fs";
import {FileHelper} from "./helpers";
// import {createReadStream} from "fs";

@Controller('meetup')
export class MeetupController {
  constructor(
    private readonly meetupService: MeetupService,
    private readonly rmqService: RmqService,
    private readonly fileHelper: FileHelper
  ) {}

  @MessagePattern({ cmd: 'findAllMeetup' })
  handleFindAllMeetups(@Ctx() context: RmqContext) {
    const meetups = this.meetupService.findAllMeetups();
    this.rmqService.ack(context);
    return meetups;
  }

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

  @MessagePattern({ cmd: 'findByIdMeetup' })
  handleFindByIdMeetups(
    @MeetupData() meetupData: IdObject,
    @Ctx() context: RmqContext,
  ) {
    const meetup = this.meetupService.findById(meetupData);
    this.rmqService.ack(context);
    return meetup;
  }

  // @MessagePattern({ cmd: 'generateReport' })
  // async handleGenerateReport(
  //     @MeetupData() reportType: TypeObject,
  //     @Ctx() context: RmqContext,
  // ) {
  //   const { type } = reportType;
  //   const doc = type === "pdf"?
  //      await this.meetupService.generateReportPDF() : await this.meetupService.generateReportCSV();
  //
  //   const PATH = path.join(__dirname, '../../reports', doc);
  //
  //   if (fs.existsSync(PATH)) {
  //     const file = await this.fileHelper.createReadStream(PATH);
  //     const info = fs.statSync(PATH);
  //     const contentType = type === 'pdf' ? 'application/pdf' : 'text/csv';
  //
  //     // res.setHeader('Content-Length', info.size);
  //     // res.setHeader('Content-Type', contentType);
  //     // res.setHeader('Content-Disposition', `attachment; filename=${doc}`);
  //     // file.pipe(res);
  //     return;
  //   }
  // }

  // @MessagePattern({ cmd: 'generateReport' })
  // async handleGenerateReport(
  //     @MeetupData() reportType: TypeObject,
  //     @Ctx() context: RmqContext,
  // ) {
  //   const { type } = reportType;
  //   const report = type === "PDF"?
  //       await this.meetupService.generateReportPDF() : await this.meetupService.generateReportCSV();
  //   this.rmqService.ack(context);
  //   return report
  // }
}
